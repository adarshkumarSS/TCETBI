from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from ..models import Program
from ..serializers import ProgramSerializer
from utils.cloudinary_utils import delete_cloudinary_image
from datetime import datetime

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except:
        return None
    

@api_view(["GET"])
def get_programs_data(request):
    programs = ProgramSerializer(Program.objects.all(), many=True).data
    return Response({"programs": programs})


@api_view(["PUT"])
@transaction.atomic
def update_programs_data(request):

    payload = request.data or {}
    existing_programs = {p.id: p for p in Program.objects.all()}

    programs_list = payload.get("programs", [])

    for program_data in programs_list:
        pid = program_data.get("id")
        new_img = program_data.get("image")

        program = existing_programs.pop(pid, None) if pid else None

        if program:
            # Image updated?
            if program.image and program.image != new_img:
                delete_cloudinary_image(program.image)

            program.title = program_data.get("title", program.title)
            program.description = program_data.get("description", program.description)
            program.image = new_img or program.image
            program.duration = program_data.get("duration", program.duration)
            program.status = program_data.get("status", program.status)
            program.startDate = parse_date(program_data.get("startDate"))
            program.endDate = parse_date(program_data.get("endDate"))
            program.save()

        else:
            Program.objects.create(
                title=program_data.get("title", ""),
                description=program_data.get("description", ""),
                image=new_img or "",
                duration=program_data.get("duration", ""),
                status=program_data.get("status", "upcoming"),
                startDate=program_data.get("startDate", ""),
                endDate=program_data.get("endDate", ""),
            )

    return Response({"message": "✅ Programs updated successfully!"})


@api_view(["DELETE"])
def delete_program_item(request, id):
    try:
        program = Program.objects.get(id=id)

        if program.image:
            delete_cloudinary_image(program.image)

        program.delete()
        return Response({"message": "✅ Program deleted"})

    except Program.DoesNotExist:
        return Response({"error": "❌ No program with this ID"}, status=404)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from ..models import Event
from ..serializers import EventSerializer
from utils.cloudinary_utils import delete_cloudinary_image
from datetime import datetime

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except:
        return None
    

@api_view(["GET"])
def get_events_data(request):
    events = EventSerializer(Event.objects.all(), many=True).data
    return Response({"events": events})


@api_view(["PUT"])
@transaction.atomic
def update_events_data(request):

    payload = request.data or {}
    existing_events = {p.id: p for p in Event.objects.all()}

    events_list = payload.get("events", [])

    for event_data in events_list:
        eid = event_data.get("id")
        new_img = event_data.get("image")

        event = existing_events.pop(eid, None) if eid else None

        if event:
            # Image updated?
            if event.image and event.image != new_img:
                delete_cloudinary_image(event.image)

            event.title = event_data.get("title", event.title)
            event.description = event_data.get("description", event.description)
            event.image = new_img or event.image
            event.duration = event_data.get("duration", event.duration)
            event.status = event_data.get("status", event.status)
            event.startDate = parse_date(event_data.get("startDate"))
            event.endDate = parse_date(event_data.get("endDate"))
            event.save()

        else:
            Event.objects.create(
                title=event_data.get("title", ""),
                description=event_data.get("description", ""),
                image=new_img or "",
                duration=event_data.get("duration", ""),
                status=event_data.get("status", "upcoming"),
                startDate=event_data.get("startDate", ""),
                endDate=event_data.get("endDate", ""),
            )

    return Response({"message": "[OK] Events updated successfully!"})


@api_view(["DELETE"])
def delete_event_item(request, id):
    try:
        event = Event.objects.get(id=id)

        if event.image:
            delete_cloudinary_image(event.image)

        event.delete()
        return Response({"message": "[OK] Event deleted"})

    except Event.DoesNotExist:
        return Response({"error": "[ERROR] No event with this ID"}, status=404)

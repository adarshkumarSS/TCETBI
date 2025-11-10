from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Founder, TBICEO, BoardMember
from ..serializers import FounderSerializer, TBICEOSerializer, BoardMemberSerializer
from utils.cloudinary_utils import delete_cloudinary_image
from rest_framework import status

@api_view(['GET'])
def get_people_data(request):
    founder = FounderSerializer(Founder.objects.first()).data
    ceo = TBICEOSerializer(TBICEO.objects.first()).data
    board_members = BoardMemberSerializer(BoardMember.objects.all(), many=True).data

    return Response({
        "founder": founder,
        "ceo": ceo,
        "board_members": board_members
    })

@api_view(["PUT"])
def update_people_data(request):
    data = request.data

    # Founder
    founder_data = data.get("founder")
    founder_obj = Founder.objects.first()
    if founder_data:
        if not founder_obj:
            Founder.objects.create(**founder_data)
        else:
            for field in ["name", "position", "bio", "experience", "email", "linkedin"]:
                if founder_data.get(field) is not None:
                    setattr(founder_obj, field, founder_data[field])
            if founder_data.get("image") and founder_obj.image != founder_data["image"]:
                if founder_obj.image:
                    delete_cloudinary_image(founder_obj.image)
                founder_obj.image = founder_data["image"]
            founder_obj.save()

    # CEO
    ceo_data = data.get("ceo")
    ceo_obj = TBICEO.objects.first()
    if ceo_data:
        if not ceo_obj:
            TBICEO.objects.create(**ceo_data)
        else:
            for field in ["name", "position", "bio", "experience", "email", "linkedin"]:
                if ceo_data.get(field) is not None:
                    setattr(ceo_obj, field, ceo_data[field])
            if ceo_data.get("image") and ceo_obj.image != ceo_data["image"]:
                if ceo_obj.image:
                    delete_cloudinary_image(ceo_obj.image)
                ceo_obj.image = ceo_data["image"]
            ceo_obj.save()

    # Board Members
    existing = {m.id: m for m in BoardMember.objects.all()}
    sent_members = data.get("board_members", [])

    for m in sent_members:
        mid = m.get("id")
        if mid and mid in existing:
            obj = existing[mid]
            for field in ["name", "position", "bio", "experience", "email", "linkedin"]:
                if m.get(field) is not None:
                    setattr(obj, field, m[field])
            if m.get("image") and obj.image != m["image"]:
                if obj.image:
                    delete_cloudinary_image(obj.image)
                obj.image = m["image"]
            obj.save()
            existing.pop(mid)
        else:
            BoardMember.objects.create(**m)

    # delete missing ones
    for r in existing.values():
        if r.image:
            delete_cloudinary_image(r.image)
        r.delete()

    return Response({"message": "✅ People data updated successfully!"})

@api_view(["DELETE"])
def delete_board_member(request, id):
    try:
        member = BoardMember.objects.get(id=id)
        # Delete image from Cloudinary if exists
        if member.image:
            delete_cloudinary_image(member.image)
        member.delete()
        return Response({"message": "✅ Board member deleted successfully!"}, status=status.HTTP_200_OK)
    except BoardMember.DoesNotExist:
        return Response({"error": "Board member not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
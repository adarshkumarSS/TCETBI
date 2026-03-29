from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Founder, TBICEO, BoardMember
from ..serializers import FounderSerializer, TBICEOSerializer, BoardMemberSerializer
from utils.cloudinary_utils import delete_cloudinary_image
from rest_framework import status
from django.db import transaction

@api_view(['GET'])
def get_people_data(request):
    from ..models import CustomSection
    from ..serializers import CustomSectionSerializer
    
    founder = FounderSerializer(Founder.objects.first()).data
    ceo = TBICEOSerializer(TBICEO.objects.first()).data
    board_members = BoardMemberSerializer(BoardMember.objects.all(), many=True).data
    
    custom_sections = CustomSectionSerializer(CustomSection.objects.all().order_by('order'), many=True).data

    return Response({
        "founder": founder,
        "ceo": ceo,
        "board_members": board_members,
        "custom_sections": custom_sections
    })

def get_images_from_members(members):
    """Extracts all Cloudinary image URLs from a list of member dicts."""
    urls = set()
    for m in members:
        img = m.get("image")
        if img and "cloudinary.com" in img:
            urls.add(img)
    return urls

@api_view(["PUT"])
@transaction.atomic
def update_people_data(request):
    from ..models import CustomSection
    data = request.data

    # Founder
    # ... (same as before) ...
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
    existing_board = {m.id: m for m in BoardMember.objects.all()}
    sent_board = data.get("board_members", [])

    for m in sent_board:
        mid = m.get("id")
        if mid and mid in existing_board:
            obj = existing_board[mid]
            for field in ["name", "position", "bio", "experience", "email", "linkedin"]:
                if m.get(field) is not None:
                    setattr(obj, field, m[field])
            if m.get("image") and obj.image != m["image"]:
                if obj.image:
                    delete_cloudinary_image(obj.image)
                obj.image = m["image"]
            obj.save()
            existing_board.pop(mid)
        else:
            # Create new board member (strip id if exists)
            m_data = m.copy()
            m_data.pop('id', None) 
            BoardMember.objects.create(**m_data)

    for r in existing_board.values():
        if r.image:
            delete_cloudinary_image(r.image)
        r.delete()

    # 🔄 Custom Sections (Clean up images in members JSON)
    sent_sections = data.get("custom_sections", [])
    existing_sections = {str(s.id): s for s in CustomSection.objects.all()}
    
    for i, section_data in enumerate(sent_sections):
        sid = str(section_data.get("id"))
        
        if sid in existing_sections:
            sec = existing_sections.pop(sid)
            
            # 🔍 IMAGE CLEANUP: Detect removed members' images
            old_urls = get_images_from_members(sec.members)
            new_urls = get_images_from_members(section_data.get("members", []))
            removed_urls = old_urls - new_urls
            for url in removed_urls:
                delete_cloudinary_image(url)

            sec.title = section_data.get("title", sec.title)
            sec.members = section_data.get("members", [])
            sec.order = i
            sec.save()
        else:
            # Create new
            CustomSection.objects.create(
                title=section_data.get("title", "Untitled Section"),
                members=section_data.get("members", []),
                order=i
            )
            
    # Delete removed sections (and ALL their members' images)
    for sec in existing_sections.values():
        urls_to_delete = get_images_from_members(sec.members)
        for url in urls_to_delete:
            delete_cloudinary_image(url)
        sec.delete()

    return Response({"message": "[OK] People data updated successfully!"})

@api_view(["DELETE"])
def delete_board_member(request, id):
    try:
        member = BoardMember.objects.get(id=id)
        # Delete image from Cloudinary if exists
        if member.image:
            delete_cloudinary_image(member.image)
        member.delete()
        return Response({"message": "[OK] Board member deleted successfully!"}, status=status.HTTP_200_OK)
    except BoardMember.DoesNotExist:
        return Response({"error": "Board member not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
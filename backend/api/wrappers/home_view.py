from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import VisionMission, Achievement, Logo, SuccessStory
from ..serializers import (
    VisionMissionSerializer,
    AchievementSerializer,
    LogoSerializer,
    SuccessStorySerializer,
)

from utils.cloudinary_utils import delete_cloudinary_image


# 📍 GET — Fetch all home page data
@api_view(['GET'])
def get_home_data(request):
    vision_mission = VisionMissionSerializer(VisionMission.objects.first()).data
    achievements = AchievementSerializer(Achievement.objects.all(), many=True).data
    logos = LogoSerializer(Logo.objects.all(), many=True).data
    stories = SuccessStorySerializer(SuccessStory.objects.all(), many=True).data

    govt_logos = [l for l in logos if l['category'] == 'govt']
    state_logos = [l for l in logos if l['category'] == 'state']

    return Response({
        "vision_mission": vision_mission,
        "achievements": achievements,
        "govt_logos": govt_logos,
        "state_logos": state_logos,
        "success_stories": stories,
    })


# 📍 PUT — Update home page data
@api_view(['PUT'])
def update_home_data(request):
    data = request.data

    # --- VISION & MISSION ---
    vm_obj = VisionMission.objects.first()
    if vm_obj:
        changed = False
        if vm_obj.vision != data['vision_mission']['vision']:
            vm_obj.vision = data['vision_mission']['vision']
            changed = True
        if vm_obj.mission != data['vision_mission']['mission']:
            vm_obj.mission = data['vision_mission']['mission']
            changed = True
        if changed:
            vm_obj.save()

    # --- ACHIEVEMENTS ---
    existing_achievements = {a.id: a for a in Achievement.objects.all()}
    sent_achievements = data.get('achievements', [])

    # update or create
    for ach in sent_achievements:
        ach_id = ach.get('id')
        if ach_id and ach_id in existing_achievements:
            obj = existing_achievements[ach_id]
            obj.number = ach['number']
            obj.suffix = ach['suffix']
            obj.label = ach['label']
            obj.save()
            existing_achievements.pop(ach_id)
        else:
            Achievement.objects.create(**ach)

    # delete missing ones
    for remaining in existing_achievements.values():
        remaining.delete()

    # --- LOGOS ---
    def sync_logos(category, logos_data):
        existing = {l.id: l for l in Logo.objects.filter(category=category)}

        for logo in logos_data:
            if not logo.get('src') or not logo.get('name'):
                continue

            logo_id = logo.get('id')
            if logo_id and logo_id in existing:
                obj = existing[logo_id]

                # ✅ delete old Cloudinary image if changed
                if obj.src and obj.src != logo.get('src'):
                    delete_cloudinary_image(obj.src)

                obj.name = logo.get('name', obj.name)
                obj.src = logo.get('src', obj.src)
                obj.save()

                existing.pop(logo_id)
            else:
                # ✅ only allow relevant fields
                allowed_fields = ["name", "src", "category"]
                filtered_data = {k: v for k, v in logo.items() if k in allowed_fields}
                filtered_data["category"] = category

                Logo.objects.create(**filtered_data)

        # ✅ delete remaining (removed) logos
        for remaining in existing.values():
            if remaining.src:
                delete_cloudinary_image(remaining.src)
            remaining.delete()


    sync_logos('govt', data.get('govt_logos', []))
    sync_logos('state', data.get('state_logos', []))

    # --- SUCCESS STORIES ---
    existing_stories = {s.id: s for s in SuccessStory.objects.all()}
    sent_stories = data.get('success_stories', [])

    for story in sent_stories:
        sid = story.get('id')
        if sid and sid in existing_stories:
            obj = existing_stories[sid]
            updated = False

            # ✅ delete old Cloudinary image if changed
            if obj.image and obj.image != story.get('image'):
                delete_cloudinary_image(obj.image)

            # ✅ only update valid fields
            for field in ['title', 'description', 'image', 'sector', 'impact']:
                if story.get(field) is not None and getattr(obj, field) != story[field]:
                    setattr(obj, field, story[field])
                    updated = True

            if updated:
                obj.save()

            existing_stories.pop(sid)
        else:
            # ✅ Only allowed fields
            allowed_fields = ['title', 'description', 'image', 'sector', 'impact']
            filtered_data = {k: v for k, v in story.items() if k in allowed_fields}
            SuccessStory.objects.create(**filtered_data)

    # ✅ delete removed success stories
    for remaining in existing_stories.values():
        if remaining.image:
            delete_cloudinary_image(remaining.image)
        remaining.delete()

    return Response({"message": "✅ Home data updated only where changed!"})

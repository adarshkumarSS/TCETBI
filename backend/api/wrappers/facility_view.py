from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction

from utils.cloudinary_utils import delete_cloudinary_image

from ..models import Facility
from ..models import FacilityVideo
from ..serializers import FacilitySerializer
from ..serializers import FacilityVideoSerializer


@api_view(["GET"])
def get_facilities_data(request):
    return Response({
        "facilities": FacilitySerializer(Facility.objects.all(), many=True).data,
        "videos": FacilityVideoSerializer(FacilityVideo.objects.all(), many=True).data,
    })


@api_view(["PUT"])
@transaction.atomic
def update_facilities_data(request):
    print("🔥 ENTERED UPDATE API")
    print("Incoming payload:", request.data)

    payload = request.data or {}

    existing_facilities = {f.id: f for f in Facility.objects.all()}
    existing_videos = {v.id: v for v in FacilityVideo.objects.all()}

    # -------- FACILITIES --------
    facilities_list = payload.get("facilities", [])

    for fac_data in facilities_list:
        fid = fac_data.get("id")
        new_img = fac_data.get("image")

        fac = existing_facilities.pop(fid, None) if fid else None

        if fac:
            if fac.image and fac.image != new_img:
                delete_cloudinary_image(fac.image)

            fac.name = fac_data.get("name", fac.name)
            fac.description = fac_data.get("description", fac.description)
            fac.image = new_img or fac.image
            fac.features = fac_data.get("features", [])
            fac.category = fac_data.get("category", fac.category)
            fac.save()

        else:
            Facility.objects.create(
                name=fac_data.get("name", ""),
                description=fac_data.get("description", ""),
                image=new_img or "",
                features=fac_data.get("features", []),
                category=fac_data.get("category", "SHARED"),
            )

    for orphan in existing_facilities.values():
        if orphan.image:
            delete_cloudinary_image(orphan.image)
        orphan.delete()
    # -------- VIDEOS --------
    videos_list = payload.get("videos", [])

    for vid_data in videos_list:
        vid_id = vid_data.get("id")

        # Convert ID safely
        try:
            vid_id = int(vid_id)
        except:
            vid_id = None

        video = existing_videos.pop(vid_id, None) if (vid_id and vid_id > 0) else None

        if video:
            video.title = vid_data.get("title", video.title)
            video.description = vid_data.get("description", video.description)
            video.url = vid_data.get("url", video.url)
            video.thumbnail = vid_data.get("thumbnail", video.thumbnail)
            video.save()
        else:
            FacilityVideo.objects.create(
                title=vid_data.get("title", ""),
                description=vid_data.get("description", ""),
                url=vid_data.get("url", ""),
                thumbnail=vid_data.get("thumbnail", ""),
            )
    return Response({"message": "✅ Facilities & Videos updated successfully!"})

@api_view(["DELETE"])
def delete_facility_item(request, id):
    # Facility
    try:
        fac = Facility.objects.get(id=id)
        if fac.image:
            delete_cloudinary_image(fac.image)
        fac.delete()
        return Response({"message": "✅ Facility deleted"})
    except Facility.DoesNotExist:
        pass

    # Video
    try:
        vid = FacilityVideo.objects.get(id=id)
        vid.delete()
        return Response({"message": "🎥 Video deleted"})
    except FacilityVideo.DoesNotExist:
        pass

    return Response({"error": "❌ No facility/video with this ID"}, status=404)

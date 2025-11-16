from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from ..models import MediaItem
from ..serializers import MediaItemSerializer
from utils.cloudinary_utils import delete_cloudinary_image


@api_view(["GET"])
def get_media_data(request):
    media = MediaItemSerializer(MediaItem.objects.all(), many=True).data
    return Response({"media": media})


@api_view(["PUT"])
def update_album(request, album_name):

    items = request.data.get("items", [])
    existing_items = MediaItem.objects.filter(album=album_name)
    existing_map = {obj.id: obj for obj in existing_items}

    created_or_updated = []

    with transaction.atomic():

        for item in items:
            mid = item.get("id")
            new_img_url = item.get("image")
            category = item.get("category") or "events"  # fallback safety

            if mid and mid in existing_map:
                # Update
                obj = existing_map.pop(mid)

                old_img = obj.image

                obj.title = item.get("title", "") or ""
                obj.description = item.get("description", "") or ""
                obj.image = new_img_url
                obj.category = category
                obj.save()

                # Delete old Cloudinary image ONLY if new one saved
                if old_img != new_img_url:
                    delete_cloudinary_image(old_img)

                created_or_updated.append(obj)

            else:
                # Create
                obj = MediaItem.objects.create(
                    album=album_name,
                    image=new_img_url,
                    title=item.get("title", "") or "",
                    description=item.get("description", "") or "",
                    category=category,
                )
                created_or_updated.append(obj)

        # Delete leftover items
        for leftover in existing_map.values():
            delete_cloudinary_image(leftover.image)
            leftover.delete()

    # Return final list with IDs
    serialized = MediaItemSerializer(created_or_updated, many=True).data

    return Response({
        "message": "Album updated",
        "items": serialized
    })


@api_view(["DELETE"])
def delete_album(request, album_name):
    items = MediaItem.objects.filter(album=album_name)

    for item in items:
        delete_cloudinary_image(item.image)
        item.delete()

    return Response({"message": "Album deleted"})

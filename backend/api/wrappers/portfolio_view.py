from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from ..models import Startup, CEO
from ..serializers import StartupSerializer
from utils.cloudinary_utils import delete_cloudinary_image


@api_view(["GET"])
def get_portfolio_data(request):
    """
    Returns all startups divided by category (current / graduated)
    """
    data = {
        "current_startups": StartupSerializer(
            Startup.objects.filter(category="current"), many=True
        ).data,
        "graduated_startups": StartupSerializer(
            Startup.objects.filter(category="graduated"), many=True
        ).data,
    }
    return Response(data)


@api_view(["PUT"])
@transaction.atomic
def update_portfolio_data(request):
    """
    Synchronizes startup and CEO data with the database.

    Handles:
    - Startup creation, update, and deletion
    - Category changes (current ↔ graduated)
    - CEO creation, update, and deletion
    - Cloudinary cleanup for replaced or removed images
    """

    payload = request.data or {}
    all_existing = {s.id: s for s in Startup.objects.prefetch_related("ceos").all()}

    def update_or_create_startup(s_data, category: str):
        sid = s_data.get("id")
        ceos_data = s_data.get("ceos", [])
        new_logo = s_data.get("logo")

        # ✅ Either fetch existing startup or create new
        startup = all_existing.pop(sid, None) if sid else None

        fields_to_update = {
            "name": s_data.get("name") or "Untitled Startup",
            "description": s_data.get("description") or "",
            "sector": s_data.get("sector") or "",
            "founded": s_data.get("founded") or "",
            "website": s_data.get("website") or "",
            "location": s_data.get("location") or "Unknown",
            "linkedin": s_data.get("linkedin") or "",
            "twitter": s_data.get("twitter") or "",
            "facebook": s_data.get("facebook") or "",
            "products": s_data.get("products", []),
            "category": category,
        }

        if startup:
            # 🧹 Clean old logo if replaced
            if startup.logo and startup.logo != new_logo:
                delete_cloudinary_image(startup.logo)

            # Update fields
            for field, value in fields_to_update.items():
                setattr(startup, field, value)

            startup.logo = new_logo or startup.logo
            startup.save()
        else:
            startup = Startup.objects.create(**fields_to_update, logo=new_logo or "")

        # ✅ Handle CEO synchronization
        existing_ceos = {ceo.id: ceo for ceo in startup.ceos.all()}

        for ceo_data in ceos_data:
            cid = ceo_data.get("id")
            new_image = ceo_data.get("image", "")
            ceo = existing_ceos.pop(cid, None) if cid else None

            if ceo:
                # 🧹 Clean old image if replaced
                if ceo.image and ceo.image != new_image:
                    delete_cloudinary_image(ceo.image)

                ceo.name = ceo_data.get("name") or ceo.name
                ceo.bio = ceo_data.get("bio") or ceo.bio
                ceo.image = new_image or ceo.image
                ceo.save()
            else:
                CEO.objects.create(
                    startup=startup,
                    name=ceo_data.get("name") or "",
                    bio=ceo_data.get("bio") or "",
                    image=new_image or "",
                )

        # 🗑️ Delete CEOs removed from frontend
        for removed_ceo in existing_ceos.values():
            if removed_ceo.image:
                delete_cloudinary_image(removed_ceo.image)
            removed_ceo.delete()

    # ✅ Loop through categories explicitly
    categories = {
        "current": payload.get("current_startups", []),
        "graduated": payload.get("graduated_startups", []),
    }

    for category, startups_list in categories.items():
        for s_data in startups_list:
            update_or_create_startup(s_data, category)

    # 🧹 Clean up startups deleted from frontend
    for orphan in all_existing.values():
        if orphan.logo:
            delete_cloudinary_image(orphan.logo)
        for ceo in orphan.ceos.all():
            if ceo.image:
                delete_cloudinary_image(ceo.image)
            ceo.delete()
        orphan.delete()

    return Response({"message": "✅ Portfolio data updated successfully!"}, status=status.HTTP_200_OK)



@api_view(["DELETE"])
def delete_startup(request, id):
    try:
        startup = Startup.objects.get(id=id)
        if startup.logo:
            delete_cloudinary_image(startup.logo)
        for ceo in startup.ceos.all():
            if ceo.image:
                delete_cloudinary_image(ceo.image)
            ceo.delete()
        startup.delete()
        return Response({"message": "✅ Startup deleted successfully!"}, status=200)
    except Startup.DoesNotExist:
        return Response({"error": "Startup not found"}, status=404)


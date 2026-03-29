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
    """
    import json
    from utils.cloudinary_utils import upload_cloudinary_image

    # 1. Parse Data
    raw_data = request.data
    if 'data' in request.data and isinstance(request.data['data'], str):
        try:
            data = json.loads(request.data['data'])
        except json.JSONDecodeError:
            return Response({"error": "[ERROR] Invalid JSON data format."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        data = raw_data or {}

    # 2. Handle File Uploads
    if request.FILES:
        for key, file_obj in request.FILES.items():
            # key formats expected: 
            # current_startups_0_logo
            # current_startups_0_ceos_0_image
            try:
                parts = key.split('_')
                if len(parts) >= 4 and parts[1] == 'startups':
                    category_key = f"{parts[0]}_{parts[1]}" # current_startups or graduated_startups
                    
                    try:
                        startup_index = int(parts[2])
                    except ValueError: continue

                    if category_key not in data: continue
                    if startup_index >= len(data[category_key]): continue
                    
                    if parts[3] == 'logo':
                        # Upload logo
                        print(f"⬆️ Uploading logo for {category_key}[{startup_index}]...")
                        url = upload_cloudinary_image(file_obj, folder="TCETBI/Startups/Logos")
                        if url:
                            data[category_key][startup_index]['logo'] = url
                        else:
                            print(f"[WARN] Failed to upload logo for {category_key}[{startup_index}]")
                            
                    elif len(parts) == 6 and parts[3] == 'ceos' and parts[5] == 'image':
                        try:
                            ceo_index = int(parts[4])
                        except ValueError: continue

                        if 'ceos' in data[category_key][startup_index] and ceo_index < len(data[category_key][startup_index]['ceos']):
                            print(f"⬆️ Uploading CEO image for {category_key}[{startup_index}] CEO [{ceo_index}]...")
                            url = upload_cloudinary_image(file_obj, folder="TCETBI/Startups/CEOs")
                            if url:
                                data[category_key][startup_index]['ceos'][ceo_index]['image'] = url
                            else:
                                print(f"[WARN] Failed to upload CEO image")

            except Exception as e:
                print(f"[ERROR] Error processing upload {key}: {e}")
                continue

    payload = data
    all_existing = {s.id: s for s in Startup.objects.prefetch_related("ceos").all()}

    def update_or_create_startup(s_data, category: str):
        sid = s_data.get("id")
        ceos_data = s_data.get("ceos", [])
        
        # SAFETY: invalid blob/data URLs should have been replaced by uploads or should be ignored
        new_logo = s_data.get("logo")
        if new_logo and (new_logo.startswith('blob:') or new_logo.startswith('data:')):
            new_logo = None

        # [OK] Either fetch existing startup or create new
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
            "owner_name": s_data.get("owner_name") or "",
            "owner_description": s_data.get("owner_description") or "",
            "owner_company_name": s_data.get("owner_company_name") or "",
            "owner_linkedin": s_data.get("owner_linkedin") or "",
        }

        if startup:
            # 🧹 Clean old logo if replaced
            if startup.logo and new_logo and startup.logo != new_logo:
                delete_cloudinary_image(startup.logo)

            # Update fields
            for field, value in fields_to_update.items():
                setattr(startup, field, value)

            if new_logo:
                startup.logo = new_logo
            startup.save()
        else:
            startup = Startup.objects.create(**fields_to_update, logo=new_logo or "")

        # [OK] Handle CEO synchronization
        existing_ceos = {ceo.id: ceo for ceo in startup.ceos.all()}

        for ceo_data in ceos_data:
            cid = ceo_data.get("id")
            
            new_image = ceo_data.get("image", "")
            if new_image and (new_image.startswith('blob:') or new_image.startswith('data:')):
                new_image = None

            ceo = existing_ceos.pop(cid, None) if cid else None

            if ceo:
                # 🧹 Clean old image if replaced
                if ceo.image and new_image and ceo.image != new_image:
                    delete_cloudinary_image(ceo.image)

                ceo.name = ceo_data.get("name") or ceo.name
                ceo.bio = ceo_data.get("bio") or ceo.bio
                if new_image:
                    ceo.image = new_image
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

    # [OK] Loop through categories explicitly
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

    return Response({"message": "[OK] Portfolio data updated successfully!"}, status=status.HTTP_200_OK)



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
        return Response({"message": "[OK] Startup deleted successfully!"}, status=200)
    except Startup.DoesNotExist:
        return Response({"error": "Startup not found"}, status=404)


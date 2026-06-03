from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import VisionMission, Achievement, Logo, SuccessStory
from ..serializers import (
    VisionMissionSerializer,
    AchievementSerializer,
    LogoSerializer,
    SuccessStorySerializer,
)
from rest_framework import status
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
    print(f"Received PUT request to update_home_data. Content-Type: {request.content_type}")
    import json
    from utils.cloudinary_utils import upload_cloudinary_image
    
    # 1. Parse Data
    # If using FormData, the JSON payload is likely in a 'data' field
    raw_data = request.data
    
    if 'data' in request.data:
        data_field = request.data['data']
        if isinstance(data_field, str):
            try:
                data = json.loads(data_field)
            except json.JSONDecodeError as e:
                print(f"[ERROR] JSON Decode Error: {e}")
                return Response({"error": f"[ERROR] Invalid JSON data format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Maybe it's already a dict if some middleware parsed it?
            data = data_field
    else:
        # Fallback for direct JSON requests (no files)
        data = raw_data

    if not isinstance(data, dict):
        return Response({"error": f"[ERROR] Expected data to be a JSON object, got {type(data).__name__}"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Handle File Uploads (Wise Usage: Only upload if data parsing worked)
    # We iterate over expected file keys and upload them
    # Key format expected from frontend: "type_index", e.g. "govt_logos_0", "success_stories_2"
    
    files_map = {
        'govt_logos': 'src',
        'state_logos': 'src',
        'success_stories': 'image'
    }

    uploaded_urls = {} # Store uploaded URLs to rollback if needed (or just to use)

    try:
        if request.FILES:
            print(f"Received {len(request.FILES)} files for upload...")

        for key, file_obj in request.FILES.items():
            # key example: "govt_logos_0"
            parts = key.rsplit('_', 1)
            if len(parts) != 2:
                print(f"[WARN] Skipping file with unexpected key format: {key}")
                continue
            
            list_name, index_str = parts
            if list_name not in files_map:
                print(f"[WARN] Skipping file with unknown list prefix: {list_name}")
                continue
                
            try:
                index = int(index_str)
                # Check if this index exists in our data and is properly formatted
                if list_name in data and isinstance(data[list_name], list) and index < len(data[list_name]):
                    # Upload!
                    print(f"Uploading file for {list_name}[{index}] ({key})...")
                    url = upload_cloudinary_image(file_obj, folder=f"TCETBI/{list_name}")
                    
                    if url:
                        # Update the data object with the new URL
                        field_name = files_map[list_name]
                        if isinstance(data[list_name][index], dict):
                            data[list_name][index][field_name] = url
                            uploaded_urls[key] = url
                        else:
                            print(f"[WARN] Item at {list_name}[{index}] is not a dict. Skipping URL update.")
                    else:
                        error_msg = f"[ERROR] Cloudinary upload failed for {key}. Check your internet connection or Cloudinary credentials."
                        print(error_msg)
                        return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if list_name not in data:
                        print(f"[WARN] '{list_name}' not found in submitted data. Skipping file {key}.")
                    elif not isinstance(data[list_name], list):
                        print(f"[WARN] '{list_name}' in submitted data is not a list. Skipping file {key}.")
                    elif index >= len(data[list_name]):
                        print(f"[WARN] Index {index} for {list_name} out of range (length {len(data[list_name])}). Skipping file {key}.")
            except ValueError:
                print(f"[WARN] Invalid index in file key: {key}")
                continue
            except Exception as e:
                print(f"[ERROR] Error processing file {key}: {e}")
                raise e # Re-raise to be caught by outer try-except

    except Exception as e:
        print(f"[ERROR] Pre-processing critical error: {e}")
        import traceback
        traceback.print_exc()
        return Response({"error": f"[ERROR] File pre-processing error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


    # 3. Process Updates (Existing Logic) with 'data' object
    print("--- [DEBUG] FINAL DATA OBJECT STATE ---")
    print(f"Govt Logos: {json.dumps(data.get('govt_logos', []), indent=2)}")
    print(f"State Logos: {json.dumps(data.get('state_logos', []), indent=2)}")
    print(f"Success Stories: {json.dumps(data.get('success_stories', []), indent=2)}")
    print("---------------------------------------")
    try:
        # --- VISION & MISSION ---
        vm_data = data.get('vision_mission') or {}
        vm_obj = VisionMission.objects.first()
        
        if vm_obj:
            changed = False
            if vm_obj.vision != vm_data.get('vision', ''):
                vm_obj.vision = vm_data.get('vision', '')
                changed = True
            if vm_obj.mission != vm_data.get('mission', ''):
                vm_obj.mission = vm_data.get('mission', '')
                changed = True
            if changed:
                vm_obj.save()
        else:
            # Create if not exists
            if vm_data.get('vision') or vm_data.get('mission'):
                VisionMission.objects.create(
                    vision=vm_data.get('vision', ''),
                    mission=vm_data.get('mission', '')
                )

        # --- ACHIEVEMENTS ---
        existing_achievements = {a.id: a for a in Achievement.objects.all()}
        sent_achievements = data.get('achievements') or []

        # update or create
        for ach in sent_achievements:
            ach_id = ach.get('id')
            if ach_id:
                # Update
                if ach_id in existing_achievements:
                    obj = existing_achievements[ach_id]
                    
                    # Validate and update number
                    if 'number' in ach and ach['number'] is not None:
                        try:
                            obj.number = int(ach['number'])
                        except (ValueError, TypeError):
                            pass # Keep original if invalid

                    obj.suffix = ach.get('suffix', obj.suffix)
                    obj.label = ach.get('label', obj.label)
                    obj.save()
                    existing_achievements.pop(ach_id)
            else:
                # Create
                if 'number' in ach and 'suffix' in ach and 'label' in ach:
                    try:
                        # Validate number before creation
                        if ach['number'] is not None:
                            num_val = int(ach['number'])
                            Achievement.objects.create(
                                number=num_val,
                                suffix=ach['suffix'],
                                label=ach['label']
                            )
                    except (ValueError, TypeError):
                        print(f"Skipping invalid achievement creation: {ach}")

        # delete missing ones
        for remaining in existing_achievements.values():
            remaining.delete()

        # --- LOGOS ---
        def sync_logos(category, logos_data):
            if not logos_data: 
                logos_data = []
            
            existing = {l.id: l for l in Logo.objects.filter(category=category)}

            for logo in logos_data:
                # Get src and name with fallbacks
                new_src = logo.get('src')
                logo_name = logo.get('name') or "Untitled Logo"
                
                # SAFETY: Never save a blob or data URL to the database.
                if new_src and (new_src.startswith('blob:') or new_src.startswith('data:')):
                    new_src = None 
                
                logo_id = logo.get('id')

                # Skip if we have absolutely no source and no ID
                if not logo_id and not new_src:
                    continue

                if logo_id and logo_id in existing:
                    obj = existing[logo_id]
                    # Delete old Cloudinary image if URL changed
                    if new_src and obj.src and obj.src != new_src:
                        delete_cloudinary_image(obj.src)

                    obj.name = logo_name
                    if new_src:
                        obj.src = new_src
                    obj.save()
                    existing.pop(logo_id)
                else:
                    # Create new logo (as long as we have a src)
                    if new_src:
                        print(f"Creating NEW logo: {logo_name} (Category: {category})")
                        Logo.objects.create(
                            name=logo_name,
                            src=new_src,
                            category=category
                        )

            # Delete removed logos
            for remaining in existing.values():
                if remaining.src:
                    delete_cloudinary_image(remaining.src)
                remaining.delete()

        sync_logos('govt', data.get('govt_logos'))
        sync_logos('state', data.get('state_logos'))

        # --- SUCCESS STORIES ---
        existing_stories = {s.id: s for s in SuccessStory.objects.all()}
        sent_stories = data.get('success_stories') or []

        for story in sent_stories:
            sid = story.get('id')
            new_image = story.get('image')
            
            # SAFETY check
            if new_image and (new_image.startswith('blob:') or new_image.startswith('data:')):
                new_image = None

            if sid and sid in existing_stories:
                obj = existing_stories[sid]
                updated = False

                if new_image and obj.image != new_image:
                    delete_cloudinary_image(obj.image)
                    obj.image = new_image
                    updated = True

                for field in ['title', 'description', 'sector', 'impact']:
                    val = story.get(field) or f"No {field.title()}"
                    if getattr(obj, field) != val:
                        setattr(obj, field, val)
                        updated = True

                if updated:
                    obj.save()
                existing_stories.pop(sid)
            else:
                # Create if we have an image
                if new_image:
                    SuccessStory.objects.create(
                        title=story.get('title') or "Untitled Story",
                        description=story.get('description') or "No description provided.",
                        image=new_image,
                        sector=story.get('sector') or "N/A",
                        impact=story.get('impact') or "N/A"
                    )

        for remaining in existing_stories.values():
            if remaining.image:
                delete_cloudinary_image(remaining.image)
            remaining.delete()
            
    except Exception as e:
        print(f"[ERROR] Logic Error in update_home_data: {e}")
        import traceback
        traceback.print_exc()
        return Response({"error": f"[ERROR] Server Error during update: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "[OK] Backend: Home data and images updated successfully!"})

@api_view(["DELETE"])
def delete_success_story(request, id):
    """
    Deletes a success story by ID and removes its image from Cloudinary if it exists.
    """
    try:
        story = SuccessStory.objects.get(id=id)

        # [OK] Remove image from Cloudinary if present
        if story.image:
            delete_cloudinary_image(story.image)

        story.delete()
        return Response({"message": "[OK] Success story deleted successfully!"}, status=status.HTTP_200_OK)

    except SuccessStory.DoesNotExist:
        return Response({"error": "[ERROR] Success story not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"[ERROR] Error deleting success story: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


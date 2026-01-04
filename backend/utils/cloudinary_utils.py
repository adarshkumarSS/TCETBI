import re
import cloudinary.uploader


def extract_public_id_from_url(url: str) -> str:
    """
    Extract public_id from Cloudinary URL.
    Handles:
    - folders
    - version numbers
    - transformations
    - file extensions
    """
    try:
        # Find the part after '/upload/' up to the extension
        match = re.search(r"/upload/(?:v\d+/)?(.+?)(\.\w+)?$", url)
        if not match:
            return None

        public_id = match.group(1)  # folder/filename (WITHOUT extension)
        
        # For raw files, we might need the extension
        # But the function signature doesn't support it yet.
        # Let's return both or handle it in the caller?
        # Better: check if we need extension based on context, but here we just extract.
        # Let's keep existing behavior for backward compatibility, but allow getting full name.
        return public_id
    except:
        return None

def extract_public_id_for_raw(url: str) -> str:
    """
    Extract public_id for raw files (includes extension).
    """
    try:
        match = re.search(r"/upload/(?:v\d+/)?(.+)$", url)
        if not match:
            return None
        return match.group(1)
    except:
        return None


def delete_cloudinary_image(url: str):
    if not url:
        return False

    public_id = extract_public_id_from_url(url)

    if not public_id:
        print(f"⚠️ Could not extract public_id from URL: {url}")
        return False

    print(f"🗑 Deleting Cloudinary image → {public_id}")

    try:
        res = cloudinary.uploader.destroy(public_id)
        print("✔ Cloudinary delete response:", res)
        return res
    except Exception as e:
        print("❌ Cloudinary delete error:", e)
        return False

def delete_cloudinary_file(url: str, resource_type: str = 'raw'):
    if not url:
        return False

    if resource_type == 'raw':
        public_id = extract_public_id_for_raw(url)
    else:
        public_id = extract_public_id_from_url(url)

    if not public_id:
        print(f"⚠️ Could not extract public_id from URL: {url}")
        return False

    print(f"🗑 Deleting Cloudinary file ({resource_type}) → {public_id}")

    try:
        res = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        print("✔ Cloudinary delete response:", res)
        return res
    except Exception as e:
        print("❌ Cloudinary delete error:", e)
        return False

def upload_cloudinary_image(file_obj, folder="TCETBI"):
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    if not file_obj:
        return None
        
    try:
        response = cloudinary.uploader.upload(file_obj, folder=folder)
        return response.get('secure_url')
    except Exception as e:
        print(f"❌ Cloudinary upload error: {e}")
        return None

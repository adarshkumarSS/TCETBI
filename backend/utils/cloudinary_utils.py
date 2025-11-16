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
        return public_id
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

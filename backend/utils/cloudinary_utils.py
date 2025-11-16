import re
import cloudinary.uploader

def delete_cloudinary_image(image_url: str):
    """
    Deletes a Cloudinary image using its public ID.
    Handles all Cloudinary URL variations including transformations.
    """
    try:
        if not image_url:
            return False

        # Remove protocol + domain
        # /image/upload/.../folder/file.jpg
        path = re.sub(r'^https?://[^/]+/', '', image_url)

        # Remove leading 'image/upload/' or 'video/upload/'
        path = re.sub(r'^(image|video)/upload/.*?/', '', path)

        # Remove file extension (.jpg, .png, .webp)
        public_id = re.sub(r'\.\w+$', '', path)

        if not public_id:
            print(f"⚠️ Could not extract public_id from: {image_url}")
            return False

        result = cloudinary.uploader.destroy(public_id)
        print(f"🗑️ Deleted Cloudinary image: {public_id}")
        return result

    except Exception as e:
        print(f"❌ Error deleting Cloudinary image: {e}")
        return False

import re
import cloudinary

def delete_cloudinary_image(image_url: str):
    """
    Deletes a Cloudinary image using its public ID extracted from the URL.
    Example URL: https://res.cloudinary.com/demo/image/upload/v169234/file_name.jpg
    """
    try:
        match = re.search(r"/upload/(?:v\d+/)?([^\.]+)", image_url)
        if not match:
            print(f"⚠️ Could not extract public_id from URL: {image_url}")
            return False

        public_id = match.group(1)
        result = cloudinary.uploader.destroy(public_id)
        print(f"🗑️ Deleted Cloudinary image {public_id}: {result}")
        return result
    except Exception as e:
        print(f"❌ Failed to delete Cloudinary image: {e}")
        return False

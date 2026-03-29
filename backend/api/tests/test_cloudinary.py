import os
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from utils.cloudinary_utils import upload_cloudinary_image, delete_cloudinary_image

class CloudinaryIntegrationTest(TestCase):
    def test_upload_and_delete_image(self):
        # 1. Create a tiny 1x1 GIF dummy image in memory (valid image format)
        image_content = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        dummy_file = SimpleUploadedFile(
            "dummy_test_image.gif", 
            image_content, 
            content_type="image/gif"
        )
        
        # 2. Upload to Cloudinary inside a specific /Test directory to keep the remote clean
        url = upload_cloudinary_image(dummy_file, folder="TCETBI/Test")
        
        # Verify it actually reached the cloud and we have a valid URL
        self.assertIsNotNone(url, "Cloudinary upload failed: URL is None")
        self.assertTrue(url.startswith("http"), f"Cloudinary upload failed: URL is invalid -> {url}")
        
        # 3. Delete from Cloudinary using the helper func
        delete_response = delete_cloudinary_image(url)
        
        self.assertTrue(bool(delete_response), "Cloudinary delete failed: Output is False")
        if isinstance(delete_response, dict):
            self.assertEqual(delete_response.get("result"), "ok", "Cloudinary delete didn't return 'ok'")

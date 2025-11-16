# scripts/seed_tbi_contact.py

import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import TBIContactInfo  # noqa

load_dotenv()

# ⚙️ Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def upload_to_cloudinary(local_path, folder="TCETBI/Maps"):
    """
    Uploads an image from local folder to Cloudinary.
    Used if you want a custom preview image (optional).
    """
    if not os.path.exists(local_path):
        print(f"⚠ Missing file: {local_path}")
        return ""
    try:
        res = cloudinary.uploader.upload(local_path, folder=folder)
        return res.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""


def seed_tbi_contact():
    print("🌱 Seeding TBIContactInfo...")

    # Clear old data
    TBIContactInfo.objects.all().delete()

    # OPTIONAL — If you want to upload a map preview image
    # base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")
    # map_preview = upload_to_cloudinary(os.path.join(base_dir, "asset/maps/tbi.png"))

    TBIContactInfo.objects.create(
        address=(
            "Thiagarajar Business Incubation Centre\n"
            "Thiagarajar College of Engineering\n"
            "Madurai - 625015, Tamil Nadu, India"
        ),
        phone="+91 452 2482240",
        email="info@tbi.edu.in",
        working_hours=(
            "Monday - Friday: 9:00 AM - 6:00 PM\n"
            "Saturday: 9:00 AM - 1:00 PM"
        ),

        # Quick Contact Section
        quick_title="Quick Contact",
        quick_subtitle="Reach out to us for immediate assistance",

        office_address=(
            "Thiagarajar Business Incubation Centre\n"
            "Thiagarajar College of Engineering\n"
            "Madurai - 625015\n"
            "Tamil Nadu, India"
        ),
        contact_phone="+91 452 2482240",
        contact_email="info@tbi.edu.in",
        website="https://www.tbi.edu.in",

        # Google Maps Embed URL
        map_embed_url=(
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!"
            "1d125778.38984218655!2d77.9238856972656!3d9.886004200000006!"
            "2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!"
            "1s0x3b00cfe9e0d71771%3A0xb00d568a6b1efdd6!"
            "2sTechnology%20Business%20Incubator%20(TCE-TBI)!5e0!3m2!"
            "1sen!2sin!4v1763308334089!5m2!1sen!2sin"
        ),

        # If you have a preview image:
        # map_preview_image=map_preview,
    )

    print("✅ TBIContactInfo seeded successfully!")


if __name__ == "__main__":
    seed_tbi_contact()

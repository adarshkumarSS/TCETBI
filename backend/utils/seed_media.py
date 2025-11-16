import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import MediaItem
load_dotenv()

# Cloudinary Config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_to_cloudinary(local_path, folder="TCETBI/Media"):
    """Uploads file to Cloudinary and returns secure_url"""
    if not os.path.exists(local_path):
        print(f"⚠ Missing image: {local_path}")
        return ""

    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""


def seed_media():
    print("🌱 Seeding Media...")

    MediaItem.objects.all().delete()

    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    mock_media = [
        # ---------- Innovation Lab Album ----------
        {
            "src": "asset/media/1.png",
            "album": "innovation-lab",
            "category": "facilities",
            "title": "",
            "description": "Modern entrance to the Innovation Lab."
        },
        {
            "src": "asset/media/6.png",
            "album": "innovation-lab",
            "category": "facilities",
            "title": "",
            "description": "Advanced research equipment."
        },
        {
            "src": "asset/media/5.png",
            "album": "innovation-lab",
            "category": "facilities",
            "title": "",
            "description": "Collaboration Zone for teams."
        },

        # ---------- Startup Showcase ----------
        {
            "src": "asset/media/1.png",
            "album": "startup-showcase",
            "category": "events",
            "title": "",
            "description": "Startup presentations on stage."
        },
        {
            "src": "asset/media/2.png",
            "album": "startup-showcase",
            "category": "events",
            "title": "",
            "description": "Networking with founders."
        },
        {
            "src": "asset/media/3.png",
            "album": "startup-showcase",
            "category": "events",
            "title": "",
            "description": "Closing ceremony highlights."
        },

        # ---------- Accelerator Program ----------
        {
            "src": "asset/media/4.png",
            "album": "accelerator-program",
            "category": "programs",
            "title": "",
            "description": "Orientation session at Accelerator."
        },
        {
            "src": "asset/media/5.png",
            "album": "accelerator-program",
            "category": "programs",
            "title": "",
            "description": "Mentor feedback session."
        },

        # ---------- Mentorship Sessions ----------
        {
            "src": "asset/media/3.png",
            "album": "mentorship-sessions",
            "category": "programs",
            "title": "",
            "description": "One-on-one mentoring."
        },
        {
            "src": "asset/media/4.png",
            "album": "mentorship-sessions",
            "category": "programs",
            "title": "",
            "description": "Group workshop."
        },
    ]

    for item in mock_media:
        local_path = os.path.join(base_dir, item["src"])
        image_url = upload_to_cloudinary(local_path)

        MediaItem.objects.create(
            image=image_url,
            album=item["album"],
            category=item["category"],
            title=item["title"],         # auto-filled in model if blank
            description=item["description"]
        )

    print("✅ Media seeded successfully!")


if __name__ == "__main__":
    seed_media()

import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv

# Load environment
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Facility, FacilityVideo
from utils.cloudinary_utils import delete_cloudinary_image

load_dotenv()

# Cloudinary setup
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_to_cloudinary(local_path, folder="TCETBI/Facilities"):
    """Uploads an image to Cloudinary and returns URL."""
    if not os.path.exists(local_path):
        print(f"⚠️ Missing file: {local_path}")
        return ""
    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""


def seed_facilities():
    print("🌱 Seeding Facilities & Videos...")

    # Base path to local assets
    frontend_public = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    # 🧹 DELETE EXISTING DATA
    print("🧹 Cleaning old Facility images...")
    for fac in Facility.objects.all():
        if fac.image:
            delete_cloudinary_image(fac.image)
    Facility.objects.all().delete()

    print("🧹 Cleaning old Facility videos...")
    FacilityVideo.objects.all().delete()


    FACILITIES = [
    {
        "name": "Co-working Spaces",
        "description": "Flexible workspaces with modern amenities.",
        "image": "asset/Infrastructure/2.png",
        "features": ["24/7 Access", "High-Speed Internet", "Meeting Rooms", "Coffee Station"],
        "category": "SHARED",
    },
    {
        "name": "Innovation Labs",
        "description": "Fully equipped R&D labs for startups.",
        "image": "asset/Infrastructure/3.png",
        "features": ["Latest Equipment", "Testing Facilities", "Research Support", "Safety Protocols"],
        "category": "SHARED",
    },
    {
        "name": "Fabrication Workshop",
        "description": "Workshops for prototyping and fabrication.",
        "image": "asset/Infrastructure/4.png",
        "features": ["3D Printing", "CNC Machines", "Electronics Lab", "Material Testing"],
        "category": "SHARED",
    },
    {
        "name": "Auditorium",
        "description": "Modern auditorium for events and showcases.",
        "image": "asset/Infrastructure/5.png",
        "features": ["200 Seating", "AV Equipment", "Stage Lighting", "Recording Setup"],
        "category": "TCETBI",
    },
    {
        "name": "Conference Halls",
        "description": "Professional conference and meeting spaces.",
        "image": "asset/Infrastructure/6.png",
        "features": ["Video Conferencing", "Presentation Setup", "Comfortable Seating", "Catering Services"],
        "category": "TCETBI",
    },
    {
        "name": "Library & Resource Center",
        "description": "Business library & research support center.",
        "image": "asset/Infrastructure/7.png",
        "features": ["Business Books", "Digital Resources", "Study Areas", "Research Support"],
        "category": "TCETBI",
    },
]


    print("📁 Uploading Facility Images...")
    for fac in FACILITIES:
        img_path = os.path.join(frontend_public, fac["image"])
        fac["image"] = upload_to_cloudinary(img_path)
        Facility.objects.create(**fac)


    VIDEOS = [
        {
            "title": "Innovation Lab Tour",
            "description": "Virtual tour of cutting-edge labs.",
            "url": "https://www.youtube.com/watch?v=_qEG9X3G7q0",
            "thumbnail": "https://img.youtube.com/vi/_qEG9X3G7q0/hqdefault.jpg",
        },
        {
            "title": "Startup Workspaces",
            "description": "Explore modern startup working zones.",
            "url": "https://www.youtube.com/watch?v=VpiqscrcbME",
            "thumbnail": "https://img.youtube.com/vi/VpiqscrcbME/hqdefault.jpg",
        },
        {
            "title": "Conference Rooms",
            "description": "Professional meeting spaces.",
            "url": "https://www.youtube.com/watch?v=XmUYtekm_EU",
            "thumbnail": "https://img.youtube.com/vi/XmUYtekm_EU/hqdefault.jpg",
        },
        {
            "title": "Prototyping Facility",
            "description": "All about fabrication tools.",
            "url": "https://www.youtube.com/watch?v=8Ome0BKLgqQ",
            "thumbnail": "https://img.youtube.com/vi/8Ome0BKLgqQ/hqdefault.jpg",
        },
        {
            "title": "Mentorship Spaces",
            "description": "Dedicated mentor lounges.",
            "url": "https://www.youtube.com/watch?v=TChiE1FDXdY",
            "thumbnail": "https://img.youtube.com/vi/TChiE1FDXdY/hqdefault.jpg",
        },
        {
            "title": "Event Auditorium",
            "description": "Huge auditorium for events.",
            "url": "https://www.youtube.com/watch?v=tc4aTZ0K3uw",
            "thumbnail": "https://img.youtube.com/vi/tc4aTZ0K3uw/hqdefault.jpg",
        },
    ]

    print("🎥 Adding Facility Videos...")
    for v in VIDEOS:
        FacilityVideo.objects.create(**v)

    print("✅ Facilities & Videos Seeded Successfully!")


if __name__ == "__main__":
    seed_facilities()

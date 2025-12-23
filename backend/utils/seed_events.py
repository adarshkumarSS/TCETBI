import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Event
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()

def upload_to_cloudinary(local_path, folder="TCETBI/Events"):
    if not os.path.exists(local_path):
        print(f"⚠ Missing image: {local_path}")
        return ""
    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""

def seed_events():
    print("🌱 Seeding Events...")

    Event.objects.all().delete()

    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    mock_events = [
        {
            "title": "Startup Accelerator Event",
            "description": "Intensive 6-month event for early-stage startups with mentorship, funding, and market access.",
            "image": "asset/events/1.png",
            "duration": "6 months",
            "startDate": "2024-01-01",
            "endDate": "2024-06-01",
            "status": "live",
        },
        {
            "title": "Innovation Bootcamp",
            "description": "Intensive 2-week bootcamp focusing on idea validation, business model design, and prototype development.",
            "image": "asset/events/2.png",
            "duration": "2 weeks",
            "startDate": "2024-04-01",
            "endDate": "2024-04-15",
            "status": "upcoming",
        },
        {
            "title": "Tech Entrepreneur Masterclass",
            "description": "Comprehensive event for technology entrepreneurs covering product development and scaling strategies.",
            "image": "asset/events/3.png",
            "duration": "3 months",
            "startDate": "2023-09-01",
            "endDate": "2023-11-30",
            "status": "ended",
        },
        {
            "title": "Women in Entrepreneurship",
            "description": "Empowering women entrepreneurs with skills, network, and funding opportunities.",
            "image": "asset/events/4.png",
            "duration": "4 months",
            "startDate": "2024-02-01",
            "endDate": "2024-05-30",
            "status": "live",
        },
        {
            "title": "Social Impact Incubator",
            "description": "Event focused on social enterprises and impact-driven startups.",
            "image": "asset/events/5.png",
            "duration": "5 months",
            "startDate": "2024-05-01",
            "endDate": "2024-09-30",
            "status": "upcoming",
        },
        {
            "title": "AgriTech Innovation Lab",
            "description": "Event for agricultural technology startups focusing on sustainable farming.",
            "image": "asset/events/6.png",
            "duration": "6 months",
            "startDate": "2023-07-01",
            "endDate": "2023-12-30",
            "status": "ended",
        },
        {
            "title": "FinTech Accelerator",
            "description": "Dedicated event for fintech startups with regulatory guidance.",
            "image": "asset/events/7.png",
            "duration": "4 months",
            "startDate": "2024-06-01",
            "endDate": "2024-09-25",
            "status": "upcoming",
        },
        {
            "title": "Healthcare Innovation Event",
            "description": "Event for healthcare startups with access to medical experts.",
            "image": "asset/events/8.png",
            "duration": "5 months",
            "startDate": "2023-03-01",
            "endDate": "2023-07-25",
            "status": "ended",
        },
        {
            "title": "CleanTech Venture Studio",
            "description": "Event for clean tech ventures focusing on sustainability.",
            "image": "asset/events/9.png",
            "duration": "6 months",
            "startDate": "2024-01-01",
            "endDate": "2024-06-01",
            "status": "live",
        },
    ]

    for event in mock_events:
        image_url = upload_to_cloudinary(os.path.join(base_dir, event["image"]))

        Event.objects.create(
            title=event["title"],
            description=event["description"],
            duration=event["duration"],
            startDate=parse_date(event["startDate"]),
            endDate=parse_date(event["endDate"]),
            status=event["status"],
            image=image_url,
        )

    print("✅ Events seeded successfully!")

if __name__ == "__main__":
    seed_events()

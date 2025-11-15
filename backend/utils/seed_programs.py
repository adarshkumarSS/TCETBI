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

from api.models import Program
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()

def upload_to_cloudinary(local_path, folder="TCETBI/Programs"):
    if not os.path.exists(local_path):
        print(f"⚠ Missing image: {local_path}")
        return ""
    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""

def seed_programs():
    print("🌱 Seeding Programs...")

    Program.objects.all().delete()

    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    mock_programs = [
        {
            "title": "Startup Accelerator Program",
            "description": "Intensive 6-month program for early-stage startups with mentorship, funding, and market access.",
            "image": "asset/programs/1.png",
            "duration": "6 months",
            "startDate": "2024-01-01",
            "endDate": "2024-06-01",
            "status": "live",
        },
        {
            "title": "Innovation Bootcamp",
            "description": "Intensive 2-week bootcamp focusing on idea validation, business model design, and prototype development.",
            "image": "asset/programs/2.png",
            "duration": "2 weeks",
            "startDate": "2024-04-01",
            "endDate": "2024-04-15",
            "status": "upcoming",
        },
        {
            "title": "Tech Entrepreneur Masterclass",
            "description": "Comprehensive program for technology entrepreneurs covering product development and scaling strategies.",
            "image": "asset/programs/3.png",
            "duration": "3 months",
            "startDate": "2023-09-01",
            "endDate": "2023-11-30",
            "status": "ended",
        },
        {
            "title": "Women in Entrepreneurship",
            "description": "Empowering women entrepreneurs with skills, network, and funding opportunities.",
            "image": "asset/programs/4.png",
            "duration": "4 months",
            "startDate": "2024-02-01",
            "endDate": "2024-05-30",
            "status": "live",
        },
        {
            "title": "Social Impact Incubator",
            "description": "Program focused on social enterprises and impact-driven startups.",
            "image": "asset/programs/5.png",
            "duration": "5 months",
            "startDate": "2024-05-01",
            "endDate": "2024-09-30",
            "status": "upcoming",
        },
        {
            "title": "AgriTech Innovation Lab",
            "description": "Program for agricultural technology startups focusing on sustainable farming.",
            "image": "asset/programs/6.png",
            "duration": "6 months",
            "startDate": "2023-07-01",
            "endDate": "2023-12-30",
            "status": "ended",
        },
        {
            "title": "FinTech Accelerator",
            "description": "Dedicated program for fintech startups with regulatory guidance.",
            "image": "asset/programs/7.png",
            "duration": "4 months",
            "startDate": "2024-06-01",
            "endDate": "2024-09-25",
            "status": "upcoming",
        },
        {
            "title": "Healthcare Innovation Program",
            "description": "Program for healthcare startups with access to medical experts.",
            "image": "asset/programs/8.png",
            "duration": "5 months",
            "startDate": "2023-03-01",
            "endDate": "2023-07-25",
            "status": "ended",
        },
        {
            "title": "CleanTech Venture Studio",
            "description": "Program for clean tech ventures focusing on sustainability.",
            "image": "asset/programs/9.png",
            "duration": "6 months",
            "startDate": "2024-01-01",
            "endDate": "2024-06-01",
            "status": "live",
        },
    ]

    for program in mock_programs:
        image_url = upload_to_cloudinary(os.path.join(base_dir, program["image"]))

        Program.objects.create(
            title=program["title"],
            description=program["description"],
            duration=program["duration"],
            startDate=parse_date(program["startDate"]),
            endDate=parse_date(program["endDate"]),
            status=program["status"],
            image=image_url,
        )

    print("✅ Programs seeded successfully!")

if __name__ == "__main__":
    seed_programs()

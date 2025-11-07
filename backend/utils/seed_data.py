import os
import sys
import django
import cloudinary.uploader

# ✅ Add Django project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# ✅ Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import VisionMission, Achievement, Logo, SuccessStory

# 🌩️ Cloudinary setup
import cloudinary
from dotenv import load_dotenv

# Load Cloudinary credentials from .env
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# ✅ Helper function to upload to Cloudinary and return secure URL
def upload_to_cloudinary(local_path, folder="tcetbi_seed_uploads"):
    try:
        if not os.path.exists(local_path):
            print(f"⚠️  File not found: {local_path}")
            return ""
        upload_result = cloudinary.uploader.upload(local_path, folder=folder)
        return upload_result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Cloudinary upload failed for {local_path}: {e}")
        return ""


def seed():
    print("🌱 Starting database seeding...")

    # Clean old data
    VisionMission.objects.all().delete()
    Achievement.objects.all().delete()
    Logo.objects.all().delete()
    SuccessStory.objects.all().delete()

    # Add Vision and Mission
    VisionMission.objects.create(
        vision="Nurturing an entrepreneurial ecosystem that supports sustainable startups.",
        mission=(
            "Enabling aspiring stakeholders (entrepreneurs, faculty, students, alumni) "
            "to convert their ideas into startups, providing access to infrastructure, "
            "mentorship, and commercialization opportunities."
        ),
    )

    # Add Achievements
    Achievement.objects.bulk_create([
        Achievement(number=150, suffix="+", label="Startups Incubated"),
        Achievement(number=500, suffix="+", label="Jobs Created"),
        Achievement(number=50, suffix="+", label="Success Stories"),
        Achievement(number=25, suffix="+", label="Awards Won"),
    ])

    # 🌩️ Upload logo images and store their Cloudinary URLs
    base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "public")

    logos = [
        {"name": "Ministry of MSME", "path": "asset/PartnerLogos/ministry_msme.png", "category": "govt"},
        {"name": "Startup India", "path": "asset/PartnerLogos/startup_india.png", "category": "govt"},
        {"name": "NSTEDB", "path": "asset/PartnerLogos/nstedb.png", "category": "govt"},
        {"name": "Tamil Nadu Govt", "path": "asset/PartnerLogos/govt_india.png", "category": "state"},
        {"name": "TIDCO", "path": "asset/PartnerLogos/tidco.png", "category": "state"},
        {"name": "TNSCST", "path": "asset/PartnerLogos/tnscst.png", "category": "state"},
    ]

    logo_objs = []
    for logo in logos:
        img_path = os.path.join(base_dir, logo["path"])
        print(f"⬆️ Uploading {logo['name']} ...")
        url = upload_to_cloudinary(img_path, folder="TCETBI/Logos")
        logo_objs.append(Logo(name=logo["name"], src=url, category=logo["category"]))
    Logo.objects.bulk_create(logo_objs)

    # 🌩️ Upload Success Story images
    stories = [
        {
            "title": "Revolutionary Water Purification",
            "description": "EcoTech Solutions developed an innovative purification system that provides clean water to 50,000 rural households.",
            "path": "asset/SuccessStoryimages/water.jpg",
            "sector": "Environmental Technology",
            "impact": "50,000+ households served",
        },
        {
            "title": "Smart Agriculture Platform",
            "description": "AgriConnect created an IoT-based system helping 10,000+ farmers increase yields by 40%.",
            "path": "asset/SuccessStoryimages/agriculture.jpg",
            "sector": "AgriTech",
            "impact": "40% yield increase for farmers",
        },
    ]

    story_objs = []
    for story in stories:
        img_path = os.path.join(base_dir, story["path"])
        print(f"⬆️ Uploading success story image for: {story['title']} ...")
        url = upload_to_cloudinary(img_path, folder="TCETBI/SuccessStories")
        story_objs.append(
            SuccessStory(
                title=story["title"],
                description=story["description"],
                image=url,
                sector=story["sector"],
                impact=story["impact"],
            )
        )
    SuccessStory.objects.bulk_create(story_objs)

    print("✅ All data and images uploaded successfully to Cloudinary!")


if __name__ == "__main__":
    seed()

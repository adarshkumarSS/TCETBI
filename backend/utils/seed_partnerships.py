import os
import sys
import django
import cloudinary.uploader

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# ✅ Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Partnership

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
def upload_to_cloudinary(local_path, folder="TCETBI/Partnerships"):
    try:
        if not os.path.exists(local_path):
            print(f"⚠️  File not found: {local_path}")
            return ""
        upload_result = cloudinary.uploader.upload(local_path, folder=folder)
        return upload_result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Cloudinary upload failed for {local_path}: {e}")
        return ""

def seed_partnerships():
    print("🌱 Seeding Partnerships...")

    # Clean old data
    Partnership.objects.all().delete()

    base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "public")

    partners = [
        {
            "name": "Zoho Corporation",
            "description": "Strategic partnership for providing cloud-based software suites to incubatees and startups. Zoho offers a comprehensive suite of business applications to help startups scale efficiently.",
            "logo_path": "asset/PartnerLogos/startup_india.png", 
            "website": "https://www.zoho.com"
        },
        {
            "name": "Ministry of MSME",
            "description": "Collaboration for implementing various government schemes and providing financial support to budding entrepreneurs. This partnership facilitates access to MSME registration and benefits.",
            "logo_path": "asset/PartnerLogos/ministry_msme.png",
            "website": "https://msme.gov.in"
        },
        {
            "name": "Startup India",
            "description": "Official partner for the Startup India initiative, helping in recognition and tax exemptions for startups. We work closely to streamline the startup ecosystem in the region.",
            "logo_path": "asset/PartnerLogos/startup_india.png",
            "website": "https://www.startupindia.gov.in"
        }
    ]

    for p in partners:
        img_path = os.path.join(base_dir, p["logo_path"])
        print(f"⬆️ Uploading logo for {p['name']} ...")
        url = upload_to_cloudinary(img_path)
        Partnership.objects.create(
            name=p["name"],
            description=p["description"],
            logo=url,
            website=p["website"]
        )

    print("✅ Partnerships seeded successfully!")

if __name__ == "__main__":
    seed_partnerships()

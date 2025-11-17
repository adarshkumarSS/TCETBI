import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv

# ✅ Setup Django environment dynamically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Founder, TBICEO, BoardMember
load_dotenv()

# ✅ Cloudinary setup
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_to_cloudinary(local_path, folder="TCETBI/People"):
    """Uploads a file to Cloudinary and returns the secure URL."""
    if not os.path.exists(local_path):
        print(f"⚠️ Missing file: {local_path}")
        return ""
    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""


def seed_people():
    print("🌱 Seeding People data...")

    # 🧹 Clean old data
    Founder.objects.all().delete()
    TBICEO.objects.all().delete()
    BoardMember.objects.all().delete()

    # ✅ Path to frontend assets
    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    # 🌟 Founder
    founder_data = {
        "name": "Dr. M. Chidambaram",
        "position": "Founder & Chairman",
        "bio": "Visionary leader with 25+ years of experience in academia and entrepreneurship. "
                "He has mentored over 200 startups and built Thiagarajar’s thriving innovation ecosystem.",
        "experience": "25+ years",
        "image": upload_to_cloudinary(os.path.join(base_dir, "asset/startup_owners/1.png")),
    }

    # 🌟 CEO
    ceo_data = {
        "name": "Mr. Vinoth Rajendran",
        "position": "Chief Executive Officer",
        "bio": "Dynamic leader with expertise in startup ecosystems and innovation management. "
                "He has driven over 100 incubation programs and partnerships with global accelerators.",
        "experience": "15+ years",
        "email": "adarshkumar@student.tce.edu",
        "linkedin": "https://www.linkedin.com/in/vinoth-rajendran-123456789/",
        "image": upload_to_cloudinary(os.path.join(base_dir, "asset/startup_owners/2.png")),
    }

    Founder.objects.create(**founder_data)
    TBICEO.objects.create(**ceo_data)

    # 🌟 Board Members
    members = [
        {
            "name": "Dr. Rajesh Kumar",
            "position": "Board Member",
            "bio": "Former industry executive with 20+ years in technology and innovation strategy.",
            "experience": "20+ years",
            "email": "rajesh.kumar@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/dr-rajesh-kumar/",
            "image": "asset/startup_owners/3.png",
        },
        {
            "name": "Ms. Lakshmi Iyer",
            "position": "Board Member",
            "bio": "Venture capitalist and startup ecosystem expert with a focus on sustainable growth.",
            "experience": "18+ years",
            "email": "lakshmi.iyer@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/lakshmi-iyer-investor/",
            "image": "asset/startup_owners/4.png",
        },
        {
            "name": "Dr. Arun Krishnan",
            "position": "Board Member",
            "bio": "Academic leader and researcher driving innovation-led entrepreneurship initiatives.",
            "experience": "22+ years",
            "email": "arun.krishnan@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/dr-arun-krishnan/",
            "image": "asset/startup_owners/5.png",
        },
        {
            "name": "Ms. Meera Nair",
            "position": "Board Member",
            "bio": "Corporate strategy and business development specialist helping startups scale globally.",
            "experience": "16+ years",
            "email": "meera.nair@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/meera-nair-bizdev/",
            "image": "asset/startup_owners/6.png",
        },
        {
            "name": "Dr. Suresh Babu",
            "position": "Board Member",
            "bio": "Expert in innovation management and technology transfer across academia and industry.",
            "experience": "19+ years",
            "email": "suresh.babu@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/dr-suresh-babu/",
            "image": "asset/startup_owners/7.png",
        },
        {
            "name": "Ms. Kavitha Reddy",
            "position": "Board Member",
            "bio": "Social entrepreneur and impact investment strategist empowering women-led startups.",
            "experience": "14+ years",
            "email": "kavitha.reddy@tbi.edu.in",
            "linkedin": "https://www.linkedin.com/in/kavitha-reddy-socialimpact/",
            "image": "asset/startup_owners/8.png",
        },
    ]

    for m in members:
        image_url = upload_to_cloudinary(os.path.join(base_dir, m["image"]))
        BoardMember.objects.create(
            name=m["name"],
            position=m["position"],
            bio=m["bio"],
            experience=m["experience"],
            email=m["email"],
            linkedin=m["linkedin"],
            image=image_url,
        )

    print("✅ People data seeded successfully!")


if __name__ == "__main__":
    seed_people()

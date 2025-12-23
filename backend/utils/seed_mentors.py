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

from api.models import Mentor
load_dotenv()

# ✅ Cloudinary setup
import cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def upload_to_cloudinary(local_path, folder="TCETBI/Mentors"):
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

def seed_mentors():
    print("🌱 Seeding Mentors data...")

    # 🧹 Clean old data
    Mentor.objects.all().delete()

    # ✅ Path to frontend assets
    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    mentors_data = [
        {
            "name": "Dr. S. J. Thiruvengadam",
            "domain": "Electronics & Communication, Signal Processing",
            "expertise": "Signal Processing, Academic Research, Innovation",
            "bio": "Expert in Signal Processing with extensive experience in academic research and innovation management.",
            "email": "sjthiru@tce.edu",
            "linkedin": "https://www.linkedin.com/in/thiruvengadam-sj/",
            "image": "asset/people/mentor1.png", # Using specific filenames as requested or placeholders
        },
        {
            "name": "Dr. K. Chockalingam",
            "domain": "Mechanical Engineering, Manufacturing",
            "expertise": "Additive Manufacturing, Product Development",
            "bio": "Specialist in Mechanical Engineering and Additive Manufacturing with a focus on product development.",
            "email": "kcmech@tce.edu",
            "linkedin": "https://www.linkedin.com/in/chockalingam-k/",
            "image": "asset/people/mentor2.png",
        },
        {
            "name": "Mr. R. Karthik Kumar",
            "domain": "Software Development, Cloud Computing",
            "expertise": "AWS, DevOps, Full Stack Development",
            "bio": "Experienced software architect helping startups scale their technical infrastructure.",
            "email": "karthik.it@tce.edu",
            "linkedin": "https://www.linkedin.com/in/karthikkumar-r/",
            "image": "asset/people/mentor3.png",
        },
        {
            "name": "Ms. Deepa V.",
            "domain": "Business Development, Marketing",
            "expertise": "Go-to-market Strategy, Branding, Sales",
            "bio": "Marketing veteran with a track record of launching successful brands in the tech space.",
            "email": "deepa.mkt@tce.edu",
            "linkedin": "https://www.linkedin.com/in/deepa-v-marketing/",
            "image": "asset/people/mentor4.png",
        },
        {
            "name": "Dr. B. Sankar",
            "domain": "Civil Engineering, Sustainability",
            "expertise": "Green Building, Smart Cities, Materials",
            "bio": "Researcher focusing on sustainable construction and smart city technologies.",
            "email": "bsankar.civil@tce.edu",
            "linkedin": "https://www.linkedin.com/in/sankar-b/",
            "image": "asset/people/mentor5.png",
        }
    ]

    for data in mentors_data:
        image_path = os.path.join(base_dir, data["image"])
        # If the local image exists, upload to Cloudinary. 
        # Otherwise, just use the string (public path handled by frontend) or a placeholder.
        if os.path.exists(image_path):
            image_url = upload_to_cloudinary(image_path)
        else:
            image_url = data["image"].replace("asset/people/", "") # Just the filename for public fallback
        
        Mentor.objects.create(
            name=data["name"],
            domain=data["domain"],
            expertise=data["expertise"],
            bio=data["bio"],
            email=data["email"],
            linkedin=data["linkedin"],
            image=image_url
        )

    print("✅ Mentors data seeded successfully!")

if __name__ == "__main__":
    seed_mentors()

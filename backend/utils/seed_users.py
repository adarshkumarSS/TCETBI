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

from api.models import AppUser
load_dotenv()

# ✅ Cloudinary setup
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def upload_to_cloudinary(local_path, folder="TCETBI/Users"):
    """Uploads a file to Cloudinary and returns the secure URL."""
    try:
        if not os.path.exists(local_path):
            print(f"⚠️ Missing file: {local_path}")
            return ""
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed for {local_path}: {e}")
        return ""

def seed_users():
    print("🌱 Seeding Users with Profile Images...")

    # We don't want to delete all users because or core admin might be there
    # But for a "clean" seed, we typically delete AppUsers
    # Let's skip deleting superusers
    AppUser.objects.filter(is_superuser=False).delete()

    base_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "frontend",
        "public",
    )

    users = [
        {
            "username": "drpriya",
            "email": "priya.sharma@ecotech.com",
            "full_name": "Dr. Priya Sharma",
            "phone": "9876543210",
            "image": "asset/startup_owners/1.png",
            "status": "approved"
        },
        {
            "username": "rahulv",
            "email": "rahul.verma@ecotech.com",
            "full_name": "Rahul Verma",
            "phone": "9876543211",
            "image": "asset/startup_owners/2.png",
            "status": "approved"
        },
        {
            "username": "rajeshk",
            "email": "rajesh.kumar@agriconnect.in",
            "full_name": "Rajesh Kumar",
            "phone": "9876543212",
            "image": "asset/startup_owners/3.png",
            "status": "approved"
        },
        {
            "username": "meenaiayer",
            "email": "meena.iyer@agriconnect.in",
            "full_name": "Meena Iyer",
            "phone": "9876543213",
            "image": "asset/startup_owners/4.png",
            "status": "approved"
        },
        {
            "username": "anithar",
            "email": "anitha.raman@healthtech.com",
            "full_name": "Dr. Anitha Raman",
            "phone": "9876543214",
            "image": "asset/startup_owners/5.png",
            "status": "approved"
        }
    ]

    for u_data in users:
        img_path = os.path.join(base_dir, u_data["image"])
        print(f"⬆️ Uploading profile image for {u_data['full_name']}...")
        profile_url = upload_to_cloudinary(img_path)
        
        user = AppUser.objects.create(
            username=u_data["username"],
            email=u_data["email"],
            full_name=u_data["full_name"],
            phone=u_data["phone"],
            profile_image=profile_url,
            status=u_data["status"],
            must_change_password=True
        )
        user.set_password("Password@123")
        user.save()

    print("✅ User data seeded successfully!")

if __name__ == "__main__":
    seed_users()

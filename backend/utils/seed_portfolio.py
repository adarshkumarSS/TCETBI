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

from api.models import Startup, CEO
load_dotenv()

# ✅ Cloudinary setup
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def upload_to_cloudinary(local_path, folder="TCETBI/Startups"):
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

def seed_portfolio():
    print("🌱 Seeding startup portfolio data...")

    # Clean old data
    CEO.objects.all().delete()
    Startup.objects.all().delete()

    base_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "frontend",
        "public",
    )

    startups = [
        # 🟢 Current Startups
        {
            "name": "EcoTech Solutions",
            "logo": "asset/current_startups/facebook.png",
            "ceos": [
                {"name": "Dr. Priya Sharma", "image": "asset/startup_owners/1.png", "bio": "Environmental engineer with 10+ years in sustainable tech."},
                {"name": "Rahul Verma", "image": "asset/startup_owners/2.png", "bio": "Co-founder specializing in clean energy R&D."},
            ],
            "description": "Revolutionary water purification technology using eco-friendly materials.",
            "sector": "Environmental Technology",
            "founded": "2023",
            "website": "https://ecotech-solutions.com",
            "location": "Bengaluru, India",
            "linkedin": "https://linkedin.com/company/ecotech",
            "twitter": "https://twitter.com/ecotech",
            "facebook": "https://facebook.com/ecotech",
            "products": [
                {"title": "EcoMeter", "desc": "IoT device for real-time pollution tracking."},
                {"title": "GreenGrid", "desc": "AI-based smart energy optimization system."},
            ],
            "category": "current",
        },
        {
            "name": "AgriConnect",
            "logo": "asset/current_startups/honda.png",
            "ceos": [
                {"name": "Rajesh Kumar", "image": "asset/startup_owners/3.png", "bio": "AgriTech specialist passionate about farmer empowerment."},
                {"name": "Meena Iyer", "image": "asset/startup_owners/4.png", "bio": "Data scientist focusing on predictive crop analytics."},
            ],
            "description": "IoT-based platform connecting farmers with modern agricultural techniques.",
            "sector": "AgriTech",
            "founded": "2023",
            "website": "https://agriconnect.in",
            "location": "Hyderabad, India",
            "linkedin": "https://linkedin.com/company/agriconnect",
            "twitter": "https://twitter.com/agriconnect",
            "facebook": "https://facebook.com/agriconnect",
            "products": [
                {"title": "FarmSense", "desc": "Crop health monitoring and soil analytics tool."},
                {"title": "AgriLink", "desc": "Marketplace for farmers and suppliers."},
            ],
            "category": "current",
        },
        {
            "name": "HealthTech Innovations",
            "logo": "asset/current_startups/google.png",
            "ceos": [
                {"name": "Dr. Anitha Raman", "image": "asset/startup_owners/5.png", "bio": "Medical doctor and AI innovator for accessible healthcare."},
                {"name": "Kiran Sethi", "image": "asset/startup_owners/6.png", "bio": "CTO with experience in AI diagnostic systems."},
            ],
            "description": "AI-powered diagnostic tools for rural healthcare centers.",
            "sector": "HealthTech",
            "founded": "2022",
            "website": "https://healthtech-innovations.com",
            "location": "Chennai, India",
            "linkedin": "https://linkedin.com/company/healthtechinnov",
            "twitter": "https://twitter.com/healthtechai",
            "facebook": "https://facebook.com/healthtech",
            "products": [
                {"title": "MediScan", "desc": "AI diagnostic tool for early disease detection."},
                {"title": "RuralCare", "desc": "Offline telemedicine platform for remote areas."},
            ],
            "category": "current",
        },
        # 🔵 Graduated Startups
        {
            "name": "TechVentures Ltd",
            "logo": "asset/current_startups/twitter.png",
            "ceos": [
                {"name": "Arun Krishnan", "image": "asset/startup_owners/7.png", "bio": "Serial entrepreneur with successful B2B exits."},
                {"name": "Nisha Rao", "image": "asset/startup_owners/8.png", "bio": "Tech strategist and COO managing enterprise automation."},
            ],
            "description": "B2B automation tools and software solutions for enterprises.",
            "sector": "Enterprise Software",
            "founded": "2019",
            "website": "https://techventures.com",
            "location": "Bengaluru, India",
            "linkedin": "https://linkedin.com/company/techventures",
            "twitter": "https://twitter.com/techventures",
            "facebook": "https://facebook.com/techventures",
            "products": [
                {"title": "WorkFlowPro", "desc": "Enterprise workflow automation suite."},
                {"title": "Insight360", "desc": "Real-time analytics and reporting engine."},
            ],
            "category": "graduated",
        },
        {
            "name": "GreenTech Systems",
            "logo": "asset/current_startups/youtube.png",
            "ceos": [
                {"name": "Lakshmi Iyer", "image": "asset/startup_owners/9.png", "bio": "Engineer driving large-scale sustainability initiatives."},
                {"name": "Abhishek Jain", "image": "asset/startup_owners/10.png", "bio": "Chief innovation officer for AI waste management systems."},
            ],
            "description": "AI-powered waste management systems for smart cities.",
            "sector": "Environmental Technology",
            "founded": "2018",
            "website": "https://greentech-systems.com",
            "location": "Delhi, India",
            "linkedin": "https://linkedin.com/company/greentechsystems",
            "twitter": "https://twitter.com/greentechsys",
            "facebook": "https://facebook.com/greentechsystems",
            "products": [
                {"title": "WasteTrack", "desc": "Smart garbage segregation and tracking system."},
                {"title": "RecycleBot", "desc": "Automated waste recycling machine."},
            ],
            "category": "graduated",
        },
                # 🟣 Emerging Startups
        {
            "name": "FinNova Labs",
            "logo": "asset/current_startups/adidas.png",
            "ceos": [
                {"name": "Aman Mehta", "image": "asset/startup_owners/11.png", "bio": "FinTech innovator focusing on micro-loans for small businesses."},
                {"name": "Sneha Kapoor", "image": "asset/startup_owners/12.png", "bio": "Blockchain expert driving secure transaction systems."},
            ],
            "description": "AI-driven financial platform simplifying lending for small and mid-sized enterprises.",
            "sector": "FinTech",
            "founded": "2024",
            "website": "https://finnovalabs.com",
            "location": "Mumbai, India",
            "linkedin": "https://linkedin.com/company/finnovalabs",
            "twitter": "https://twitter.com/finnovalabs",
            "facebook": "https://facebook.com/finnovalabs",
            "products": [
                {"title": "CreditIQ", "desc": "AI-based credit scoring system for MSMEs."},
                {"title": "SmartPay", "desc": "Instant micro-loan and repayment platform."},
            ],
            "category": "current",
        },
        {
            "name": "EduSphere",
            "logo": "asset/current_startups/instagram.png",
            "ceos": [
                {"name": "Ritika Sen", "image": "asset/startup_owners/13.png", "bio": "Education reformer passionate about digital learning accessibility."},
                {"name": "Aditya Bansal", "image": "asset/startup_owners/14.png", "bio": "EdTech engineer designing adaptive AI tutors."},
            ],
            "description": "Personalized AI learning companion for K–12 students, focusing on regional languages.",
            "sector": "EdTech",
            "founded": "2022",
            "website": "https://edusphere.ai",
            "location": "Pune, India",
            "linkedin": "https://linkedin.com/company/edusphereai",
            "twitter": "https://twitter.com/edusphereai",
            "facebook": "https://facebook.com/edusphereai",
            "products": [
                {"title": "LearnMate", "desc": "AI-based personalized tutor with gamified modules."},
                {"title": "ClassSync", "desc": "Teacher-student collaboration dashboard."},
            ],
            "category": "current",
        },
        {
            "name": "AutoVolt Motors",
            "logo": "asset/current_startups/mi.png",
            "ceos": [
                {"name": "Vikram Chauhan", "image": "asset/startup_owners/15.png", "bio": "EV design expert with 15+ years in sustainable mobility."},
                {"name": "Nidhi Rawat", "image": "asset/startup_owners/16.png", "bio": "Battery tech researcher building efficient EV ecosystems."},
            ],
            "description": "EV startup creating modular electric vehicles optimized for Indian terrain.",
            "sector": "Automotive / CleanTech",
            "founded": "2023",
            "website": "https://autovoltmotors.com",
            "location": "Gurugram, India",
            "linkedin": "https://linkedin.com/company/autovoltmotors",
            "twitter": "https://twitter.com/autovoltindia",
            "facebook": "https://facebook.com/autovoltmotors",
            "products": [
                {"title": "VoltX", "desc": "Compact modular EV for urban commuting."},
                {"title": "ChargeNet", "desc": "Smart EV charging grid management system."},
            ],
            "category": "current",
        },
        {
            "name": "CyberSentinel AI",
            "logo": "asset/current_startups/tiktok.png",
            "ceos": [
                {"name": "Harshit Desai", "image": "asset/startup_owners/17.png", "bio": "Ex-ethical hacker turned cybersecurity entrepreneur."},
                {"name": "Rina Das", "image": "asset/startup_owners/18.png", "bio": "AI researcher focusing on real-time intrusion detection."},
            ],
            "description": "AI-first cybersecurity startup preventing threats before they occur.",
            "sector": "Cybersecurity",
            "founded": "2021",
            "website": "https://cybersentinel.ai",
            "location": "Bengaluru, India",
            "linkedin": "https://linkedin.com/company/cybersentinelai",
            "twitter": "https://twitter.com/cybersentinelai",
            "facebook": "https://facebook.com/cybersentinelai",
            "products": [
                {"title": "ThreatEye", "desc": "Predictive threat intelligence platform."},
                {"title": "Shield360", "desc": "Endpoint security powered by ML anomaly detection."},
            ],
            "category": "graduated",
        },
        {
            "name": "MedGenomeX",
            "logo": "asset/current_startups/whatsapp.png",
            "ceos": [
                {"name": "Dr. Suresh Nambiar", "image": "asset/startup_owners/19.png", "bio": "Biotech leader advancing genetic diagnostics."},
                {"name": "Kavya Thomas", "image": "asset/startup_owners/20.png", "bio": "Bioinformatics expert driving genomic AI analysis."},
            ],
            "description": "Biotech startup combining genomics and AI to predict hereditary diseases early.",
            "sector": "BioTech / HealthTech",
            "founded": "2022",
            "website": "https://medgenomex.com",
            "location": "Kochi, India",
            "linkedin": "https://linkedin.com/company/medgenomex",
            "twitter": "https://twitter.com/medgenomex",
            "facebook": "https://facebook.com/medgenomex",
            "products": [
                {"title": "GenePredict", "desc": "AI-assisted hereditary disease prediction."},
                {"title": "GenomeVault", "desc": "Encrypted cloud storage for genomic data."},
            ],
            "category": "current",
        },
        {
            "name": "AeroNext Robotics",
            "logo": "asset/current_startups/google.png",
            "ceos": [
                {"name": "Karan Thakur", "image": "asset/startup_owners/21.png", "bio": "Aerospace engineer innovating drone-based logistics."},
                {"name": "Mitali Joshi", "image": "asset/startup_owners/22.png", "bio": "Robotics researcher focused on AI navigation systems."},
            ],
            "description": "Autonomous drone delivery systems for remote and urban areas.",
            "sector": "AeroTech / Robotics",
            "founded": "2024",
            "website": "https://aeronext.in",
            "location": "Ahmedabad, India",
            "linkedin": "https://linkedin.com/company/aeronext",
            "twitter": "https://twitter.com/aeronextindia",
            "facebook": "https://facebook.com/aeronext",
            "products": [
                {"title": "SkyCourier", "desc": "Autonomous parcel delivery drones."},
                {"title": "PathAI", "desc": "Real-time route optimization for aerial navigation."},
            ],
            "category": "graduated",
        },

    ]

    for s in startups:
        logo_path = os.path.join(base_dir, s["logo"])
        print(f"⬆️ Uploading logo for {s['name']}...")
        logo_url = upload_to_cloudinary(logo_path, folder="TCETBI/Startups/Logos")

        startup = Startup.objects.create(
            name=s["name"],
            logo=logo_url,
            description=s["description"],
            sector=s["sector"],
            founded=s["founded"],
            website=s["website"],
            location=s["location"],
            linkedin=s["linkedin"],
            twitter=s["twitter"],
            facebook=s["facebook"],
            products=s["products"],
            category=s["category"],
        )

        for i, ceo_data in enumerate(s["ceos"]):
            # Use available images (1-10.png) by cycling if data image is missing or just as a fallback
            image_filename = f"{(i % 10) + 1}.png" # Default fallback
            
            # If the image path in data looks like startup_owners/XX.png, we can try that first
            # but we know only 1-10 exist.
            ceo_path = os.path.join(base_dir, ceo_data["image"])
            if not os.path.exists(ceo_path):
                # Map 11-22 back to 1-10
                img_num = int(ceo_data["image"].split('/')[-1].split('.')[0])
                fallback_num = ((img_num - 1) % 10) + 1
                ceo_path = os.path.join(base_dir, f"asset/startup_owners/{fallback_num}.png")

            ceo_url = upload_to_cloudinary(ceo_path, folder="TCETBI/Startups/CEOs")
            CEO.objects.create(
                startup=startup,
                name=ceo_data["name"],
                image=ceo_url,
                bio=ceo_data["bio"],
            )

    print("✅ Portfolio data seeded successfully!")

if __name__ == "__main__":
    seed_portfolio()

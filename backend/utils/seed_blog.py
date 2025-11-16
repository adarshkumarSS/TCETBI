import os
import sys
import django
import cloudinary.uploader
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Blog

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def upload_to_cloudinary(local_path, folder="TCETBI/Blogs"):
    if not os.path.exists(local_path):
        print(f"⚠ Missing image: {local_path}")
        return ""
    try:
        result = cloudinary.uploader.upload(local_path, folder=folder)
        return result.get("secure_url", "")
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return ""


def seed_blogs():
    print("🌱 Seeding Blogs...")

    Blog.objects.all().delete()

    base_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

    mock_blogs = [
        {
            "id": 1,
            "title": "The Future of Startup Incubation: Trends to Watch in 2024",
            "excerpt": "Explore the latest trends shaping the startup ecosystem and how incubators are adapting to support emerging technologies and business models.",
            "author": "Dr. Sarah Johnson",
            "category": "Innovation",
            "image": "asset/programs/1.png",
            "readTime": 5,
            "link": "/blogs/1",
        },
        {
            "id": 2,
            "title": "Success Story: How TechFlow Revolutionized Agricultural Technology",
            "excerpt": "Learn about TechFlow's journey from a small startup idea to a leading AgTech company, and the role our incubation program played in their success.",
            "author": "Mark Thompson",
            "category": "Success Stories",
            "image": "asset/programs/2.png",
            "readTime": 7,
            "link": "/blogs/2",
        },
        {
            "id": 3,
            "title": "Building a Sustainable Startup: Environmental Considerations",
            "excerpt": "Discover how modern startups are integrating sustainability into their core business models and creating positive environmental impact.",
            "author": "Dr. Emily Chen",
            "category": "Sustainability",
            "image": "asset/programs/3.png",
            "readTime": 6,
            "link": "/blogs/3",
        },
        {
            "id": 4,
            "title": "Funding Strategies for Early-Stage Startups",
            "excerpt": "A comprehensive guide to various funding options available for startups, from bootstrapping to venture capital and everything in between.",
            "author": "Robert Kim",
            "category": "Funding",
            "image": "asset/programs/4.png",
            "readTime": 8,
            "link": "/blogs/4",
        },
        {
            "id": 5,
            "title": "The Role of AI in Modern Business Innovation",
            "excerpt": "Examining how artificial intelligence is transforming business operations and creating new opportunities for startup ventures.",
            "author": "Dr. Michael Rodriguez",
            "category": "Technology",
            "image": "asset/programs/5.png",
            "readTime": 6,
            "link": "/blogs/5",
        },
        {
            "id": 6,
            "title": "Networking in the Digital Age: Building Meaningful Connections",
            "excerpt": "Tips and strategies for entrepreneurs to build valuable professional networks in an increasingly digital world.",
            "author": "Lisa Anderson",
            "category": "Networking",
            "image": "asset/programs/6.png",
            "readTime": 4,
            "link": "/blogs/6",
        },
        {
            "id": 7,
            "title": "Women in Entrepreneurship: Breaking Barriers and Creating Change",
            "excerpt": "Celebrating female entrepreneurs and examining the unique challenges and opportunities they face in today's business landscape.",
            "author": "Dr. Priya Sharma",
            "category": "Diversity",
            "image": "asset/programs/7.png",
            "readTime": 5,
            "link": "/blogs/7",
        },
        {
            "id": 8,
            "title": "From Prototype to Product: The Development Journey",
            "excerpt": "A detailed look at the product development process and how our facilities support startups in bringing their ideas to life.",
            "author": "James Wilson",
            "category": "Product Development",
            "image": "asset/programs/8.png",
            "readTime": 7,
            "link": "/blogs/8",
        },
        {
            "id": 9,
            "title": "Global Markets: Expanding Your Startup Internationally",
            "excerpt": "Strategies and considerations for startups looking to expand their operations beyond domestic markets.",
            "author": "Ana Martinez",
            "category": "Global Business",
            "image": "asset/programs/9.png",
            "readTime": 6,
            "link": "/blogs/9",
        },
    ]

    for blog in mock_blogs:
        img_path = os.path.join(base_dir, blog["image"])
        cloud_url = upload_to_cloudinary(img_path)

        Blog.objects.create(
            title=blog["title"],
            excerpt=blog["excerpt"],
            author=blog["author"],
            category=blog["category"],
            image=cloud_url,
            readTime=blog["readTime"],
            link=blog["link"],
        )

    print("✅ Blogs seeded successfully!")

if __name__ == "__main__":
    seed_blogs()

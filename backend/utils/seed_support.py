import os
import django
from django.contrib.auth import get_user_model
from api.models import Mentor, FundingRequest, MentoringRequest, ValidationRequest

def seed_support():
    print("🌱 Seeding Support Services data...")
    
    User = get_user_model()
    # Ensure a test user exists
    user, created = User.objects.get_or_create(username="testuser", defaults={"email": "test@example.com"})
    if created:
        user.set_password("password")
        user.save()
        print("👤 Created test user: testuser")

    # Seed Mentors
    Mentor.objects.all().delete()
    mentors = [
        {"name": "Dr. A. Smith", "domain": "AI/ML", "expertise": "Deep Learning, NLP", "email": "asmith@example.com"},
        {"name": "Ms. B. Jones", "domain": "Fintech", "expertise": "Blockchain, Payments", "email": "bjones@example.com"},
        {"name": "Mr. C. Lee", "domain": "IoT", "expertise": "Embedded Systems, Sensors", "email": "clee@example.com"},
    ]
    
    for m in mentors:
        Mentor.objects.create(**m)
    print(f"✅ Created {len(mentors)} mentors")

    # Seed Requests
    FundingRequest.objects.all().delete()
    MentoringRequest.objects.all().delete()
    ValidationRequest.objects.all().delete()

    FundingRequest.objects.create(
        user=user,
        startup_name="AI Health",
        scheme="idea_hackathon",
        description="AI for early disease detection.",
        amount_requested="500000",
        status="submitted"
    )
    
    mentor = Mentor.objects.first()
    MentoringRequest.objects.create(
        user=user,
        startup_name="Fintech Pay",
        domain="Fintech",
        mentor=mentor,
        description="Need guidance on regulatory compliance.",
        status="approved"
    )
    
    ValidationRequest.objects.create(
        user=user,
        startup_name="Smart Home",
        idea_details="IoT based home automation.",
        testing_requirements="Lab testing for sensors.",
        target_market="Home owners",
        status="rejected",
        admin_notes="Idea needs more refinement."
    )
    
    print("✅ Created sample support requests")

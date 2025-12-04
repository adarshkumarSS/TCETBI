from django.db import models

class VisionMission(models.Model):
    vision = models.TextField()
    mission = models.TextField()

    def __str__(self):
        return "Vision & Mission"

class Achievement(models.Model):
    number = models.IntegerField()
    suffix = models.CharField(max_length=10)
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label

class Logo(models.Model):
    CATEGORY_CHOICES = [
        ('govt', 'Government'),
        ('state', 'State'),
    ]
    name = models.CharField(max_length=100)
    src = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name

class SuccessStory(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.CharField(max_length=255)
    sector = models.CharField(max_length=100)
    impact = models.CharField(max_length=100)

    def __str__(self):
        return self.title

from django.db import models

class Startup(models.Model):
    CATEGORY_CHOICES = [
        ('current', 'Current Startup'),
        ('graduated', 'Graduated Startup'),
    ]

    name = models.CharField(max_length=255)
    logo = models.URLField(max_length=500)
    description = models.TextField(blank=True, null=True)
    sector = models.CharField(max_length=255)
    founded = models.CharField(max_length=50)
    website = models.URLField(max_length=500)
    location = models.CharField(max_length=255, default="Unknown")

    linkedin = models.URLField(max_length=500, blank=True, null=True)
    twitter = models.URLField(max_length=500, blank=True, null=True)
    facebook = models.URLField(max_length=500, blank=True, null=True)

    # Each startup can have multiple products/services (title + desc)
    products = models.JSONField(default=list)  # [{ "title": "X", "desc": "Y" }]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.category})"


class CEO(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name="ceos")
    name = models.CharField(max_length=255)
    image = models.URLField(max_length=500)
    bio = models.TextField()

    def __str__(self):
        return f"{self.name} - {self.startup.name}"

class Founder(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=150)
    image = models.TextField()  # Cloudinary URL
    bio = models.TextField()
    experience = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class TBICEO(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=150)
    image = models.TextField()
    bio = models.TextField()
    experience = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class BoardMember(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=150)
    image = models.TextField()
    bio = models.TextField()
    experience = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Facility(models.Model):
    CATEGORY_CHOICES = [
        ("SHARED", "Shared Infrastructure"),
        ("TCETBI", "TCETBI Infrastructure"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.TextField()  # Cloudinary URL
    features = models.JSONField(default=list)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name

class FacilityVideo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.TextField()  # store FULL YouTube link
    thumbnail = models.TextField()

    def __str__(self):
        return self.title

class Program(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.TextField()  # Cloudinary URL
    duration = models.CharField(max_length=100)

    STATUS_CHOICES = (
        ('live', 'Live'),
        ('upcoming', 'Upcoming'),
        ('ended', 'Ended'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    startDate = models.DateField()
    endDate = models.DateField()

    def __str__(self):
        return self.title
    
# api/models.py
class MediaItem(models.Model):
    CATEGORY_CHOICES = (
        ('events', 'Events'),
        ('facilities', 'Facilities'),
        ('startups', 'Startups'),
        ('programs', 'Programs'),
    )

    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    image = models.TextField()

    album = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.title or self.title.strip() == "":
            self.title = self.album.replace("-", " ").title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title or "Untitled Media"

class Blog(models.Model):
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    image = models.TextField()     # Cloudinary URL
    readTime = models.PositiveIntegerField(default=5)
    link = models.TextField()      # internal/external blog URL

    def __str__(self):
        return self.title
    
class TBIContactInfo(models.Model):
    # Main contact information
    address = models.TextField()
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    working_hours = models.TextField()

    # Quick Contact section
    quick_title = models.CharField(max_length=200, default="Quick Contact")
    quick_subtitle = models.CharField(
        max_length=255,
        default="Reach out to us for immediate assistance",
    )

    office_address = models.TextField()
    contact_phone = models.CharField(max_length=50)
    contact_email = models.EmailField()
    website = models.URLField(blank=True, null=True)

    # Google Maps embed URL
    map_embed_url = models.TextField()

    def __str__(self):
        return "TBI Contact Information"

class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
    
from django.db import models

class Notification(models.Model):
    NOTI_TYPES = (
        ("contact", "Contact Message"),
        ("application", "Incubation Application"),
        ("user_registration", "User Registration"),
        ("blog", "Blog Update"),
        ("program", "Program Update"),
        ("general", "General"),
    )

    type = models.CharField(max_length=30, choices=NOTI_TYPES, default="general")
    title = models.CharField(max_length=255)
    message = models.TextField()

    # 🔥 Add this
    meta = models.JSONField(null=True, blank=True)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.type}] {self.title}"

from django.db import models

class IncubationApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    # Image + PDF
    profile_image = models.URLField(blank=True, null=True)
    resume_pdf = models.URLField(blank=True, null=True)

    # Personal
    businessName = models.CharField(max_length=255)
    salutation = models.CharField(max_length=50)
    fullName = models.CharField(max_length=255)
    fatherName = models.CharField(max_length=255)
    age = models.IntegerField()
    email = models.EmailField()
    resMobile = models.CharField(max_length=20)
    offMobile = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    post = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    # Business
    businessType = models.CharField(max_length=100)
    legalEntity = models.CharField(max_length=100)
    businessDescription = models.TextField()

    # Services (JSON field)
    services = models.JSONField(default=dict)

    numChairs = models.IntegerField(blank=True, null=True)
    fullTimeEmployees = models.IntegerField(blank=True, null=True)
    partTimeEmployees = models.IntegerField(blank=True, null=True)
    consultants = models.IntegerField(blank=True, null=True)

    # References
    reference1 = models.JSONField(default=dict)
    reference2 = models.JSONField(default=dict)

    declaration = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fullName} - {self.businessName}"


from django.contrib.auth.models import AbstractUser

class AppUser(AbstractUser):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('blocked', 'Blocked'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    phone = models.CharField(max_length=20, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name='appuser_set',
        related_query_name='appuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='appuser_set',
        related_query_name='appuser',
    )

    def __str__(self):
        return f"{self.username} ({self.status})"

class UserCompanyRequest(models.Model):
    user = models.ForeignKey('AppUser', on_delete=models.CASCADE, related_name='company_requests')

    name = models.CharField(max_length=255)
    logo = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    sector = models.CharField(max_length=255)
    founded = models.CharField(max_length=50)
    website = models.CharField(max_length=500, blank=True, null=True)
    location = models.CharField(max_length=255, default="Unknown")

    linkedin = models.CharField(max_length=500, blank=True, null=True)
    twitter = models.CharField(max_length=500, blank=True, null=True)
    facebook = models.CharField(max_length=500, blank=True, null=True)

    # Each company can have multiple products/services (title + desc)
    products = models.JSONField(default=list)  # [{ "title": "X", "desc": "Y" }]

    # CEO details
    ceo_name = models.CharField(max_length=255, blank=True, null=True)
    ceo_image = models.CharField(max_length=500, blank=True, null=True)
    ceo_bio = models.TextField(blank=True, null=True)

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted for Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    admin_notes = models.TextField(blank=True, null=True)

    # For edit requests on already approved companies
    is_edit_request = models.BooleanField(default=False)
    edit_changes_summary = models.TextField(blank=True, null=True)  # User describes what changed
    original_startup = models.ForeignKey('Startup', on_delete=models.SET_NULL, null=True, blank=True, related_name='edit_requests')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.username} ({self.status})"

class Mentor(models.Model):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    image = models.TextField() # Cloudinary URL
    bio = models.TextField()
    linkedin = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.name

class FundingRequest(models.Model):
    SCHEME_CHOICES = (
        ('idea_hackathon', 'Idea Hackathon'),
        ('nidhi_prayas', 'NIDHI PRAYAS'),
        ('nidhi_eir', 'NIDHI EIR'),
        ('sisfs', 'SISFS'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey('AppUser', on_delete=models.CASCADE, related_name='funding_requests', null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    startup_name = models.CharField(max_length=255)
    scheme = models.CharField(max_length=50, choices=SCHEME_CHOICES)
    description = models.TextField()
    pitch_deck = models.TextField() # URL to PDF/Deck
    amount_requested = models.CharField(max_length=100, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.startup_name} - {self.scheme}"

class MentoringRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('scheduled', 'Mentoring Scheduled'),
    )

    user = models.ForeignKey('AppUser', on_delete=models.CASCADE, related_name='mentoring_requests', null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    startup_name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    mentor = models.ForeignKey(Mentor, on_delete=models.SET_NULL, null=True, blank=True, related_name='requests')
    description = models.TextField() # Basic details / specific request
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.startup_name} - {self.domain}"

class ValidationRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'Validation In Progress'),
    )

    user = models.ForeignKey('AppUser', on_delete=models.CASCADE, related_name='validation_requests', null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    startup_name = models.CharField(max_length=255)
    idea_details = models.TextField()
    testing_requirements = models.TextField()
    target_market = models.CharField(max_length=255, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.startup_name} - Validation"

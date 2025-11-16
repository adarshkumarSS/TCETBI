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
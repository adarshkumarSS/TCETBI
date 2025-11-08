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

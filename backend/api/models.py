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

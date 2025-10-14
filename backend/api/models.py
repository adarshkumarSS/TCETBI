from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import secrets

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('pending', 'Pending'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='pending')
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = secrets.randbelow(1000000)
            self.otp_code = str(self.otp_code).zfill(6)
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
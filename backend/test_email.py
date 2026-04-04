import os
import django

# Set up Django environment manually
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("Sending test email using Django configuration...")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")

try:
    send_mail(
        subject='TCETBI Email Testing',
        message='This is a test email sent from the Django backend to verify the email configuration is working.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.EMAIL_HOST_USER], # send to self for testing
        fail_silently=False,
    )
    print("Test email sent SUCCESSFULLY!")
except Exception as e:
    print(f"ERROR sending test email: {e}")

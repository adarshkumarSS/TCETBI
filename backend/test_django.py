import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
try:
    django.setup()
    print("Django setup successful!")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    
    from django.core.mail import send_mail
    print("Attempting to send a test email...")
    send_mail(
        'Test Subject from Django Test',
        'This is a test email sent from the Django test script.',
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER], # send to self
        fail_silently=False,
    )
    print("Test email sent successfully!")
except Exception as e:
    print(f"Error during Django setup or email sending: {e}")

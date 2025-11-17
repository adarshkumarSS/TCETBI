#!/usr/bin/env python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@tcetbi.edu')
    admin_password = os.getenv('ADMIN_PASSWORD', 'Admin@123')

    if not User.objects.filter(username=admin_email).exists():
        User.objects.create_superuser(
            username=admin_email,
            email=admin_email,
            password=admin_password,
            is_staff=True,
            is_superuser=True,
            first_name='Admin',
            last_name='TCETBI'
        )
        print(f"Admin user {admin_email} created successfully")
    else:
        print(f"Admin user {admin_email} already exists")

if __name__ == '__main__':
    create_admin()

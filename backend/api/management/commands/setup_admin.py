from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create the initial admin users'

    def handle(self, *args, **options):
        admins = [
            {
                'email': 'zainadarsh@gmail.com',
                'username': 'zainadarsh@gmail.com',
                'password': 'admin123',
                'first_name': 'Zain',
                'last_name': 'Adarsh'
            },
            {
                'email': 'admin@tce.tci',
                'username': 'admin@tce.tci', 
                'password': 'admin123',
                'first_name': 'TCE',
                'last_name': 'Admin'
            }
        ]
        
        for admin_data in admins:
            if not User.objects.filter(email=admin_data['email']).exists():
                User.objects.create_superuser(
                    username=admin_data['username'],
                    email=admin_data['email'],
                    password=admin_data['password'],
                    first_name=admin_data['first_name'],
                    last_name=admin_data['last_name'],
                    role='admin',
                    is_verified=True
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created admin user: {admin_data["email"]}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Admin user already exists: {admin_data["email"]}')
                )
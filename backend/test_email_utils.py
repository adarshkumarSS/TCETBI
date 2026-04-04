import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.utils.email_utils import send_submission_status_email, send_incubation_email_to_ceo
from django.conf import settings
from api.models import TBICEO

test_email = settings.EMAIL_HOST_USER

print("\nSkipping status email test...")

print("\nTesting send_incubation_email_to_ceo...")
try:
    # Ensure a fake CEO exists for test
    print("Getting or creating CEO...")
    ceo, created = TBICEO.objects.get_or_create(
        name="Test CEO",
        email=test_email,
        linkedin="https://linkedin.com/test",
        position="CEO",
        image="placeholder.jpg" # Required field, arbitrary for test
    )
    print("Got CEO:", ceo)
except Exception as e:
    print("Error creating CEO:", e)
    import traceback
    traceback.print_exc()

application_data = {
    'id': 999,
    'businessName': 'Test Startup',
    'fullName': 'John Doe',
    'salutation': 'Mr.',
    'businessType': 'IT',
    'legalEntity': 'Private Limited',
    'businessDescription': 'This is a test description over here.',
    'fatherName': 'Test Father',
    'age': 25,
    'email': test_email,
    'resMobile': '9876543210',
    'offMobile': '0123456789',
    'address': 'Test Address 123',
    'city': 'TestCity',
    'state': 'TestState',
    'post': '123456',
    'country': 'India',
    'numChairs': 5,
    'fullTimeEmployees': 2,
    'partTimeEmployees': 3,
    'consultants': 1,
    'services': '{"wifi": true, "desk": true}',
    'reference1': {'name': 'Ref 1', 'mobile': '111', 'email': 'ref1@test.com', 'address': 'addr 1'},
    'reference2': {'name': 'Ref 2', 'mobile': '222', 'email': 'ref2@test.com', 'address': 'addr 2'},
}

import traceback
try:
    print("Calling send_incubation_email_to_ceo...")
    sys.stdout.flush()
    send_incubation_email_to_ceo(application_data)
    print("Successfully called send_incubation_email_to_ceo, check logs/email.")
except Exception as e:
    print(f"Error in send_incubation_email_to_ceo: {e}")
    traceback.print_exc()

# Clean up fake CEO if we created it
try:
    if 'created' in locals() and created:
        print("Cleaning up CEO...")
        ceo.delete()
        print("Cleaned up CEO.")
except Exception as e:
    print("Error deleting CEO:", e)

print("Test complete.")

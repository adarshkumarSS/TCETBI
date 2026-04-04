import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import FormSubmission, FundingRequest, MentoringRequest, ValidationRequest

def sync_existing_submissions():
    print("Starting sync of existing Form Submissions to legacy models...")
    submissions = FormSubmission.objects.all()
    count = 0
    for submission in submissions:
        form_type = submission.form_template.form_type
        field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
        user = submission.user

        if form_type == 'funding_support':
            # Check if exists (by matching created_at ideally, but let's just create if we don't match)
            # Actually just create them to ensure they appear
            funding, created = FundingRequest.objects.get_or_create(
                name=field_values.get('name').value if field_values.get('name') else '',
                startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                scheme=field_values.get('scheme').value if field_values.get('scheme') else 'other',
                defaults={
                    'user': user,
                    'email': field_values.get('email').value if field_values.get('email') else '',
                    'phone': field_values.get('phone').value if field_values.get('phone') else '',
                    'description': field_values.get('description').value if field_values.get('description') else '',
                    'amount_requested': field_values.get('amount_requested').value if field_values.get('amount_requested') else '',
                    'pitch_deck': field_values.get('pitch_deck').file_url if field_values.get('pitch_deck') else '',
                    'created_at': submission.created_at
                }
            )
            if created:
                print(f"✅ Synced FundingRequest: {funding.startup_name}")
                count += 1

        elif form_type == 'mentoring_support':
            mentor, created = MentoringRequest.objects.get_or_create(
                name=field_values.get('name').value if field_values.get('name') else '',
                startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                domain=field_values.get('domain').value if field_values.get('domain') else '',
                defaults={
                    'user': user,
                    'email': field_values.get('email').value if field_values.get('email') else '',
                    'phone': field_values.get('phone').value if field_values.get('phone') else '',
                    'description': field_values.get('description').value if field_values.get('description') else '',
                    'created_at': submission.created_at
                }
            )
            if created:
                print(f"✅ Synced MentoringRequest: {mentor.startup_name}")
                count += 1

        elif form_type == 'idea_validation':
            val, created = ValidationRequest.objects.get_or_create(
                name=field_values.get('name').value if field_values.get('name') else '',
                startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                defaults={
                    'user': user,
                    'email': field_values.get('email').value if field_values.get('email') else '',
                    'phone': field_values.get('phone').value if field_values.get('phone') else '',
                    'idea_details': field_values.get('idea_details').value if field_values.get('idea_details') else '',
                    'testing_requirements': field_values.get('testing_requirements').value if field_values.get('testing_requirements') else '',
                    'target_market': field_values.get('target_market').value if field_values.get('target_market') else '',
                    'created_at': submission.created_at
                }
            )
            if created:
                print(f"✅ Synced ValidationRequest: {val.startup_name}")
                count += 1

    print(f"Sync complete. {count} new legacy records created.")

if __name__ == '__main__':
    sync_existing_submissions()

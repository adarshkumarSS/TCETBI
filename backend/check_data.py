import os, django, sys
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from api.models import FormSubmission, FormFieldValue
subs = FormSubmission.objects.all()
for s in subs:
    print(f"Submission ID: {s.id}, Template Type: {s.form_template.form_type}, Field Count: {s.field_values.count()}")
    for fv in s.field_values.all():
        print(f"  Field: {fv.field.field_name}, Value: {fv.value[:20]}")

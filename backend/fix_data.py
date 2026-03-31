import os, django, sys
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from api.models import FormSubmission, FormTemplate, IncubationApplication, FormFieldValue, FormField

def fix_data():
    template = FormTemplate.objects.filter(form_type='incubation_application').first()
    if not template:
        print("Template not found!")
        return

    fields = {f.field_name: f for f in template.fields.all()}
    print(f"Syncing {IncubationApplication.objects.count()} applications...")

    for app in IncubationApplication.objects.all():
        # Find or create submission
        # We try to find a submission by looking for a FormFieldValue with email value?
        # A safer way: create a new submission if one doesn't exist for this specific app (by email and biz name)
        
        email_field = fields.get('email')
        biz_field = fields.get('businessName')
        
        sub = None
        if email_field and biz_field:
            # Look for existing submission with these values
            # (Just for safety, avoiding duplicates)
            existing_subs = FormSubmission.objects.filter(form_template=template)
            for s in existing_subs:
                e_val = s.field_values.filter(field=email_field, value=app.email).exists()
                b_val = s.field_values.filter(field=biz_field, value=app.businessName).exists()
                if e_val and b_val:
                    sub = s
                    break
        
        if not sub:
            sub = FormSubmission.objects.create(
                form_template=template,
                status=app.status
            )
            # Override auto-now fields manually if possible
            # (Django often forbids this, so we just accept current time)
            print(f"Created submission {sub.id} for {app.businessName}")
        
        # Sync values
        for fname, field in fields.items():
            val = getattr(app, fname, None)
            if val is not None:
                fv, created = FormFieldValue.objects.get_or_create(
                    submission=sub,
                    field=field,
                    defaults={'value': str(val)}
                )
                if not created:
                    fv.value = str(val)
                    fv.save()
            
            # Handle files separately
            if fname == 'profile_image':
                fv = FormFieldValue.objects.filter(submission=sub, field=field).first()
                if fv: fv.file_url = app.profile_image; fv.save()
            if fname == 'resume_pdf':
                fv = FormFieldValue.objects.filter(submission=sub, field=field).first()
                if fv: fv.file_url = app.resume_pdf; fv.save()

    print("Data fixed!")

if __name__ == "__main__":
    fix_data()

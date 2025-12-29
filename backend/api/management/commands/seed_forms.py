from django.core.management.base import BaseCommand
from api.models import FormTemplate, FormField


class Command(BaseCommand):
    help = 'Seed initial form templates with fields'

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding initial form templates...")
        
        # 1. Funding Support Form
        funding_template, created = FormTemplate.objects.get_or_create(
            form_type='funding_support',
            defaults={
                'name': 'Funding Support',
                'description': 'Apply for funding schemes like NIDHI PRAYAS, NIDHI EIR, SISFS, and Idea Hackathon',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Funding Support template"))
            funding_fields = [
                {'field_name': 'name', 'label': 'Full Name', 'field_type': 'text', 'is_required': True, 'order': 0},
                {'field_name': 'email', 'label': 'Email Address', 'field_type': 'email', 'is_required': True, 'order': 1},
                {'field_name': 'phone', 'label': 'Phone Number', 'field_type': 'phone', 'is_required': True, 'order': 2},
                {'field_name': 'startup_name', 'label': 'Startup / Company Name', 'field_type': 'text', 'is_required': True, 'order': 3},
                {
                    'field_name': 'scheme', 
                    'label': 'Funding Scheme', 
                    'field_type': 'select', 
                    'is_required': True, 
                    'order': 4,
                    'options': ['Idea Hackathon', 'NIDHI PRAYAS', 'NIDHI EIR', 'SISFS', 'Other']
                },
                {'field_name': 'amount_requested', 'label': 'Amount Required (in ₹)', 'field_type': 'number', 'is_required': False, 'order': 5},
                {'field_name': 'description', 'label': 'Startup Details & Funding Purpose', 'field_type': 'textarea', 'is_required': True, 'order': 6, 'placeholder': 'Tell us about your startup and why you need this funding...'},
                {'field_name': 'pitch_deck', 'label': 'Upload Pitch Deck (PDF)', 'field_type': 'file', 'is_required': False, 'order': 7},
            ]
            
            for field_data in funding_fields:
                FormField.objects.create(form_template=funding_template, **field_data)
            self.stdout.write(f"  Added {len(funding_fields)} fields")
        
        # 2. Mentoring Support Form
        mentoring_template, created = FormTemplate.objects.get_or_create(
            form_type='mentoring_support',
            defaults={
                'name': 'Mentoring Support',
                'description': 'Connect with industry experts and seasoned entrepreneurs',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Mentoring Support template"))
            mentoring_fields = [
                {'field_name': 'name', 'label': 'Your Name', 'field_type': 'text', 'is_required': True, 'order': 0},
                {'field_name': 'email', 'label': 'Email', 'field_type': 'email', 'is_required': True, 'order': 1},
                {'field_name': 'phone', 'label': 'Phone', 'field_type': 'phone', 'is_required': False, 'order': 2},
                {'field_name': 'startup_name', 'label': 'Startup Name', 'field_type': 'text', 'is_required': True, 'order': 3},
                {'field_name': 'domain', 'label': 'Domain', 'field_type': 'text', 'is_required': False, 'order': 4},
                {'field_name': 'description', 'label': 'Mentoring Needs', 'field_type': 'textarea', 'is_required': True, 'order': 5},
            ]
            
            for field_data in mentoring_fields:
                FormField.objects.create(form_template=mentoring_template, **field_data)
            self.stdout.write(f"  Added {len(mentoring_fields)} fields")
        
        # 3. Idea Validation Form
        validation_template, created = FormTemplate.objects.get_or_create(
            form_type='idea_validation',
            defaults={
                'name': 'Idea Validation',
                'description': 'Validate your MVP, test your assumptions, and refine your product strategy',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Idea Validation template"))
            validation_fields = [
                {'field_name': 'name', 'label': 'Your Name', 'field_type': 'text', 'is_required': True, 'order': 0},
                {'field_name': 'email', 'label': 'Email Address', 'field_type': 'email', 'is_required': True, 'order': 1},
                {'field_name': 'phone', 'label': 'Phone', 'field_type': 'phone', 'is_required': False, 'order': 2},
                {'field_name': 'startup_name', 'label': 'Idea Title / Startup Name', 'field_type': 'text', 'is_required': True, 'order': 3},
                {'field_name': 'target_market', 'label': 'Domain (e.g. HealthTech, EdTech)', 'field_type': 'text', 'is_required': True, 'order': 4},
                {'field_name': 'idea_details', 'label': 'Detailed Idea Description', 'field_type': 'textarea', 'is_required': True, 'order': 5, 'placeholder': 'What problem are you solving? How does your product work?'},
                {'field_name': 'testing_requirements', 'label': 'Testing & Validation Requirements', 'field_type': 'textarea', 'is_required': False, 'order': 6, 'placeholder': 'What specific help do you need for validation?'},
                {'field_name': 'pitch_deck', 'label': 'Upload Pitch Deck (PDF/PPTX)', 'field_type': 'file', 'is_required': False, 'order': 7},
            ]
            
            for field_data in validation_fields:
                FormField.objects.create(form_template=validation_template, **field_data)
            self.stdout.write(f"  Added {len(validation_fields)} fields")
        
        # 4. Contact Form
        contact_template, created = FormTemplate.objects.get_or_create(
            form_type='contact',
            defaults={
                'name': 'Contact Us',
                'description': 'Get in touch with us',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Contact template"))
            contact_fields = [
                {'field_name': 'name', 'label': 'Name', 'field_type': 'text', 'is_required': True, 'order': 0},
                {'field_name': 'email', 'label': 'Email', 'field_type': 'email', 'is_required': True, 'order': 1},
                {'field_name': 'phone', 'label': 'Phone', 'field_type': 'phone', 'is_required': False, 'order': 2},
                {'field_name': 'subject', 'label': 'Subject', 'field_type': 'text', 'is_required': True, 'order': 3},
                {'field_name': 'message', 'label': 'Message', 'field_type': 'textarea', 'is_required': True, 'order': 4},
            ]
            
            for field_data in contact_fields:
                FormField.objects.create(form_template=contact_template, **field_data)
            self.stdout.write(f"  Added {len(contact_fields)} fields")
        
        # 5. Incubation Application Form
        incubation_template, created = FormTemplate.objects.get_or_create(
            form_type='incubation_application',
            defaults={
                'name': 'Incubation Application',
                'description': 'Application for Incubation Services at TCE-TBI',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Incubation Application template"))
            incubation_fields = [
                # Profile
                {'field_name': 'profile_image', 'label': 'Profile Photo', 'field_type': 'file', 'is_required': True, 'order': 0},
                {'field_name': 'resume', 'label': 'Entrepreneur Resume (PDF)', 'field_type': 'file', 'is_required': True, 'order': 1},
                
                # Business Information
                {'field_name': 'businessName', 'label': 'Name of Business', 'field_type': 'text', 'is_required': True, 'order': 2},
                {'field_name': 'businessDescription', 'label': 'Business Description', 'field_type': 'textarea', 'is_required': True, 'order': 3},
                {
                    'field_name': 'businessType', 
                    'label': 'Type of Business', 
                    'field_type': 'select', 
                    'is_required': True, 
                    'order': 4,
                    'options': ['Services', 'High Technology', 'Other']
                },
                {
                    'field_name': 'legalEntity', 
                    'label': 'Legal Entity', 
                    'field_type': 'select', 
                    'is_required': True, 
                    'order': 5,
                    'options': ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Other']
                },
                
                # Personal Information
                {
                    'field_name': 'salutation', 
                    'label': 'Salutation', 
                    'field_type': 'select', 
                    'is_required': True, 
                    'order': 6,
                    'options': ['Mr', 'Mrs', 'Dr', 'Prof']
                },
                {'field_name': 'fullName', 'label': 'Full Name', 'field_type': 'text', 'is_required': True, 'order': 7},
                {'field_name': 'fatherName', 'label': 'Father Name', 'field_type': 'text', 'is_required': True, 'order': 8},
                {'field_name': 'age', 'label': 'Age', 'field_type': 'number', 'is_required': True, 'order': 9},
                {'field_name': 'email', 'label': 'Email', 'field_type': 'email', 'is_required': True, 'order': 10, 'help_text': 'This email will be your primary login ID if approved.'},
                {'field_name': 'resMobile', 'label': 'Residential Mobile', 'field_type': 'phone', 'is_required': True, 'order': 11},
                {'field_name': 'offMobile', 'label': 'Office Mobile', 'field_type': 'phone', 'is_required': False, 'order': 12},
                {'field_name': 'address', 'label': 'Postal / Residential Address', 'field_type': 'textarea', 'is_required': True, 'order': 13},
                {'field_name': 'city', 'label': 'City', 'field_type': 'text', 'is_required': True, 'order': 14},
                {'field_name': 'state', 'label': 'State', 'field_type': 'text', 'is_required': True, 'order': 15},
                {'field_name': 'post', 'label': 'Post', 'field_type': 'text', 'is_required': True, 'order': 16},
                {'field_name': 'country', 'label': 'Country', 'field_type': 'text', 'is_required': True, 'order': 17},
                
                # Employee Information
                {'field_name': 'numChairs', 'label': 'Number of Chairs Required', 'field_type': 'number', 'is_required': False, 'order': 18},
                {'field_name': 'fullTimeEmployees', 'label': 'Full Time Employees', 'field_type': 'number', 'is_required': False, 'order': 19},
                {'field_name': 'partTimeEmployees', 'label': 'Part Time Employees', 'field_type': 'number', 'is_required': False, 'order': 20},
                {'field_name': 'consultants', 'label': 'Consultants', 'field_type': 'number', 'is_required': False, 'order': 21},
                
                # References
                {'field_name': 'reference1Name', 'label': 'Reference 1 - Name', 'field_type': 'text', 'is_required': True, 'order': 22},
                {'field_name': 'reference1Mobile', 'label': 'Reference 1 - Mobile', 'field_type': 'phone', 'is_required': True, 'order': 23},
                {'field_name': 'reference1Email', 'label': 'Reference 1 - Email', 'field_type': 'email', 'is_required': True, 'order': 24},
                {'field_name': 'reference1Address', 'label': 'Reference 1 - Address', 'field_type': 'textarea', 'is_required': True, 'order': 25},
                
                {'field_name': 'reference2Name', 'label': 'Reference 2 - Name', 'field_type': 'text', 'is_required': True, 'order': 26},
                {'field_name': 'reference2Mobile', 'label': 'Reference 2 - Mobile', 'field_type': 'phone', 'is_required': True, 'order': 27},
                {'field_name': 'reference2Email', 'label': 'Reference 2 - Email', 'field_type': 'email', 'is_required': True, 'order': 28},
                {'field_name': 'reference2Address', 'label': 'Reference 2 - Address', 'field_type': 'textarea', 'is_required': True, 'order': 29},
                
                # Declaration
                {'field_name': 'declaration', 'label': 'I agree to the terms and conditions', 'field_type': 'checkbox', 'is_required': True, 'order': 30},
            ]
            
            for field_data in incubation_fields:
                FormField.objects.create(form_template=incubation_template, **field_data)
            self.stdout.write(f"  Added {len(incubation_fields)} fields")
        
        self.stdout.write(self.style.SUCCESS("\n✨ Form seeding complete!"))
        self.stdout.write(f"Total templates: {FormTemplate.objects.count()}")
        self.stdout.write(f"Total fields: {FormField.objects.count()}")

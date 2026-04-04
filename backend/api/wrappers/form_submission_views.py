from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import cloudinary.uploader

from ..models import FormTemplate, FormField, FormSubmission, FormFieldValue, Notification, IncubationApplication
from ..serializers import FormTemplateSerializer, FormSubmissionSerializer
from ..utils.email_utils import send_incubation_email_to_ceo, send_approval_email, send_submission_status_email
from ..utils.drive_utils import upload_to_drive
import json


@api_view(['GET'])
@permission_classes([AllowAny])
def get_form_structure(request, form_type):
    """Get form structure for public use with fallback to default template."""
    template = FormTemplate.objects.filter(form_type=form_type, is_active=True).first()
    
    if not template:
        # Check if it exists at all (maybe inactive)
        all_template = FormTemplate.objects.filter(form_type=form_type).first()
        if all_template and not all_template.is_active:
            return Response({'error': 'Form is currently inactive'}, status=status.HTTP_404_NOT_FOUND)

        # It's actually missing, create it on the fly using the seed script as fallback
        try:
            import sys, os
            if os.path.join(os.path.dirname(__file__), '..', '..') not in sys.path:
                sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
            from utils.seed_initial_forms import seed_forms
            seed_forms()
        except Exception as e:
            print(f"Fallback seed error: {e}")

        # Fetch again to get fully seeded template
        template = FormTemplate.objects.filter(form_type=form_type, is_active=True).first()
        if not template:
            return Response({'error': f'Invalid form type or seed failed: {form_type}'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = FormTemplateSerializer(template)
    return Response(serializer.data)


@api_view(['POST'])
@transaction.atomic
def submit_form(request, form_type):
    """Submit form data (public endpoint)"""
    try:
        template = FormTemplate.objects.get(form_type=form_type, is_active=True)
        
        # Create submission
        submission = FormSubmission.objects.create(
            form_template=template,
            user=request.user if request.user.is_authenticated else None
        )
        
        # Process field values
        form_data = request.data
        files = request.FILES
        
        for field in template.fields.all():
            field_name = field.field_name
            value = form_data.get(field_name, '')
            file_url = None
            
            # Handle file uploads
            if field.field_type == 'file' and field_name in files:
                file = files[field_name]
                ext = file.name.split('.')[-1].lower() if '.' in file.name else ''
                is_image = ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
                
                if is_image:
                    # Upload images to Cloudinary
                    folder = f"TCETBI/FormSubmissions/{form_type}/Images"
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder=folder,
                        resource_type="image"
                    )
                    file_url = upload_result.get('secure_url')
                    value = file.name
                else:
                    # Upload non-images to Google Drive
                    print(f"[DRIVE-DEBUG] Attempting upload for {file.name}")
                    drive_view_link, drive_file_id = upload_to_drive(file, file.name)
                    if drive_view_link:
                        print(f"[DRIVE-DEBUG] SUCCESS: {drive_view_link}")
                        file_url = drive_view_link
                        value = f"{file.name} (G-Drive)"
                    else:
                        print(f"[DRIVE-DEBUG] FAILED, falling back to Cloudinary")
                        # Reset file pointer before fallback in case Drive read it
                        file.seek(0)
                        # Fallback to Cloudinary auto if Drive fails
                        folder = f"TCETBI/FormSubmissions/{form_type}/Documents"
                        upload_result = cloudinary.uploader.upload(
                            file,
                            folder=folder,
                            resource_type="auto"
                        )
                        file_url = upload_result.get('secure_url')
                        print(f"[CLOUDINARY-DEBUG] Fallback URL: {file_url}")
                        value = file.name
            
            # Create field value
            FormFieldValue.objects.create(
                submission=submission,
                field=field,
                value=str(value),
                file_url=file_url
            )
        
        # Determine notification type based on form_type
        noti_type = 'general'
        if form_type == 'incubation_application':
            noti_type = 'application'
        elif form_type in ['funding_support', 'mentoring_support', 'idea_validation']:
            noti_type = 'support'
        elif form_type == 'mentor_application':
            noti_type = 'mentor'
        elif form_type == 'contact':
            noti_type = 'contact'

        # Create notification
        Notification.objects.create(
            type=noti_type,
            title=f'New {template.name} Submission',
            message=f'A new {template.name} has been submitted by {form_data.get("fullName", "User")}.',
            meta={'submission_id': submission.id, 'form_type': form_type}
        )

        # SPECIAL HANDLING FOR INCUBATION APPLICATION
        if form_type == 'incubation_application':
            try:
                # Gather all values into a dict for mapping
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                
                # Map dynamic fields to IncubationApplication model
                inc_app = IncubationApplication.objects.create(
                    businessName=field_values.get('businessName').value if field_values.get('businessName') else 'N/A',
                    salutation=field_values.get('salutation').value if field_values.get('salutation') else 'Mr',
                    fullName=field_values.get('fullName').value if field_values.get('fullName') else 'N/A',
                    fatherName=field_values.get('fatherName').value if field_values.get('fatherName') else 'N/A',
                    age=int(field_values.get('age').value) if field_values.get('age') and field_values.get('age').value.isdigit() else 0,
                    email=field_values.get('email').value if field_values.get('email') else 'N/A',
                    resMobile=field_values.get('resMobile').value if field_values.get('resMobile') else 'N/A',
                    offMobile=field_values.get('offMobile').value if field_values.get('offMobile') else None,
                    address=field_values.get('address').value if field_values.get('address') else 'N/A',
                    city=field_values.get('city').value if field_values.get('city') else 'N/A',
                    state=field_values.get('state').value if field_values.get('state') else 'N/A',
                    post=field_values.get('post').value if field_values.get('post') else 'N/A',
                    country=field_values.get('country').value if field_values.get('country') else 'N/A',
                    businessType=field_values.get('businessType').value if field_values.get('businessType') else 'Other',
                    legalEntity=field_values.get('legalEntity').value if field_values.get('legalEntity') else 'Other',
                    businessDescription=field_values.get('businessDescription').value if field_values.get('businessDescription') else 'N/A',
                    numChairs=int(field_values.get('numChairs').value) if field_values.get('numChairs') and field_values.get('numChairs').value.isdigit() else None,
                    fullTimeEmployees=int(field_values.get('fullTimeEmployees').value) if field_values.get('fullTimeEmployees') and field_values.get('fullTimeEmployees').value.isdigit() else None,
                    partTimeEmployees=int(field_values.get('partTimeEmployees').value) if field_values.get('partTimeEmployees') and field_values.get('partTimeEmployees').value.isdigit() else None,
                    consultants=int(field_values.get('consultants').value) if field_values.get('consultants') and field_values.get('consultants').value.isdigit() else None,
                    declaration=True if field_values.get('declaration') and field_values.get('declaration').value.lower() == 'true' else False,
                    profile_image=field_values.get('profile_image').file_url if field_values.get('profile_image') else None,
                    resume_pdf=field_values.get('resume').file_url if field_values.get('resume') else None,
                )
                
                # Map References
                reference1 = {
                    "name": field_values.get('reference1Name').value if field_values.get('reference1Name') else '',
                    "mobile": field_values.get('reference1Mobile').value if field_values.get('reference1Mobile') else '',
                    "email": field_values.get('reference1Email').value if field_values.get('reference1Email') else '',
                    "address": field_values.get('reference1Address').value if field_values.get('reference1Address') else '',
                }
                reference2 = {
                    "name": field_values.get('reference2Name').value if field_values.get('reference2Name') else '',
                    "mobile": field_values.get('reference2Mobile').value if field_values.get('reference2Mobile') else '',
                    "email": field_values.get('reference2Email').value if field_values.get('reference2Email') else '',
                    "address": field_values.get('reference2Address').value if field_values.get('reference2Address') else '',
                }
                inc_app.reference1 = reference1
                inc_app.reference2 = reference2
                inc_app.save()
                
                # Send email to CEO/Admin
                send_incubation_email_to_ceo(inc_app)
                print(f"[RE-SYNC] Created IncubationApplication #{inc_app.id} from FormSubmission #{submission.id}")
                
            except Exception as inc_err:
                print(f"[ERROR] Failed to re-sync incubation application: {inc_err}")
                # Don't fail the whole request if re-sync fails

        # SYNC OTHER SUPPORT FORMS TO THE LEGACY MODELS
        elif form_type == 'funding_support':
            try:
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                from ..models import FundingRequest
                FundingRequest.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    name=field_values.get('name').value if field_values.get('name') else '',
                    email=field_values.get('email').value if field_values.get('email') else '',
                    phone=field_values.get('phone').value if field_values.get('phone') else '',
                    startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                    scheme=field_values.get('scheme').value if field_values.get('scheme') else 'other',
                    description=field_values.get('description').value if field_values.get('description') else '',
                    amount_requested=field_values.get('amount_requested').value if field_values.get('amount_requested') else '',
                    pitch_deck=field_values.get('pitch_deck').file_url if field_values.get('pitch_deck') else ''
                )
            except Exception as e:
                print(f"[ERROR] Failed to re-sync FundingRequest: {e}")

        elif form_type == 'mentoring_support':
            try:
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                from ..models import MentoringRequest
                MentoringRequest.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    name=field_values.get('name').value if field_values.get('name') else '',
                    email=field_values.get('email').value if field_values.get('email') else '',
                    phone=field_values.get('phone').value if field_values.get('phone') else '',
                    startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                    domain=field_values.get('domain').value if field_values.get('domain') else '',
                    description=field_values.get('description').value if field_values.get('description') else ''
                )
            except Exception as e:
                print(f"[ERROR] Failed to re-sync MentoringRequest: {e}")

        elif form_type == 'idea_validation':
            try:
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                from ..models import ValidationRequest
                ValidationRequest.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    name=field_values.get('name').value if field_values.get('name') else '',
                    email=field_values.get('email').value if field_values.get('email') else '',
                    phone=field_values.get('phone').value if field_values.get('phone') else '',
                    startup_name=field_values.get('startup_name').value if field_values.get('startup_name') else '',
                    idea_details=field_values.get('idea_details').value if field_values.get('idea_details') else '',
                    testing_requirements=field_values.get('testing_requirements').value if field_values.get('testing_requirements') else '',
                    target_market=field_values.get('target_market').value if field_values.get('target_market') else ''
                )
            except Exception as e:
                print(f"[ERROR] Failed to re-sync ValidationRequest: {e}")
        
        serializer = FormSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form not found or inactive'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_submissions(request):
    """List all form submissions (admin)"""
    form_type = request.query_params.get('form_type')
    status_filter = request.query_params.get('status')
    
    submissions = FormSubmission.objects.all().select_related('form_template', 'user').prefetch_related('field_values')
    
    if form_type:
        submissions = submissions.filter(form_template__form_type=form_type)
    if status_filter:
        submissions = submissions.filter(status=status_filter)
    
    submissions = submissions.order_by('-created_at')
    
    serializer = FormSubmissionSerializer(submissions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_submission_detail(request, submission_id):
    """Get submission details (admin)"""
    try:
        submission = FormSubmission.objects.select_related('form_template', 'user').prefetch_related('field_values').get(id=submission_id)
        serializer = FormSubmissionSerializer(submission)
        return Response(serializer.data)
    except FormSubmission.DoesNotExist:
        return Response(
            {'error': 'Submission not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_submission_status(request, submission_id):
    """Update submission status (admin)"""
    try:
        submission = FormSubmission.objects.get(id=submission_id)
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes')
        
        if new_status:
            old_status = submission.status
            submission.status = new_status
            
            # SPECIAL HANDLING FOR INCUBATION APPROVAL
            if submission.form_template.form_type == 'incubation_application' and new_status == 'approved' and old_status != 'approved':
                # Map dynamic fields to send approval email
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                
                email = field_values.get('email').value if field_values.get('email') else None
                fullName = field_values.get('fullName').value if field_values.get('fullName') else 'User'
                businessName = field_values.get('businessName').value if field_values.get('businessName') else 'Startup'
                businessDescription = field_values.get('businessDescription').value if field_values.get('businessDescription') else ''
                businessType = field_values.get('businessType').value if field_values.get('businessType') else ''
                city = field_values.get('city').value if field_values.get('city') else ''
                state = field_values.get('state').value if field_values.get('state') else ''
                resMobile = field_values.get('resMobile').value if field_values.get('resMobile') else ''
                
                if email:
                    send_approval_email(email, fullName, businessName, businessDescription, businessType, city, state, resMobile)
                    
                    # Also try to update the linked IncubationApplication if it exists (by search since they aren't FK'd)
                    try:
                        inc_app = IncubationApplication.objects.filter(email=email, businessName=businessName).order_by('-created_at').first()
                        if inc_app:
                            inc_app.status = 'approved'
                            inc_app.save()
                    except:
                        pass
                        
            elif submission.form_template.form_type == 'mentor_application' and new_status == 'approved' and old_status != 'approved':
                # Map dynamic fields to create a Mentor entry
                field_values = {fv.field.field_name: fv for fv in submission.field_values.all()}
                
                from ..models import Mentor
                try:
                    Mentor.objects.create(
                        name=field_values.get('name').value if field_values.get('name') else (field_values.get('fullName').value if field_values.get('fullName') else 'Unknown'),
                        email=field_values.get('email').value if field_values.get('email') else None,
                        designation=field_values.get('designation').value if field_values.get('designation') else '',
                        domain=field_values.get('domain').value if field_values.get('domain') else '',
                        expertise=field_values.get('expertise').value if field_values.get('expertise') else '',
                        years_of_experience=int(field_values.get('experience').value) if field_values.get('experience') and field_values.get('experience').value.isdigit() else 0,
                        bio=field_values.get('bio').value if field_values.get('bio') else '',
                        linkedin=field_values.get('linkedin').value if field_values.get('linkedin') else '',
                        image=field_values.get('profile_image').file_url if field_values.get('profile_image') else '',
                        status='approved'
                    )
                except Exception as e:
                    print(f"[ERROR] Failed to create Mentor from application: {e}")
            
            # GENERIC STATUS UPDATE EMAIL (for non-incubation or rejections)
            elif (new_status in ['approved', 'rejected']) and (new_status != old_status):
                # Map dynamic fields
                field_values_map = {fv.field.field_name: fv.value for fv in submission.field_values.all()}
                email = field_values_map.get('email') or field_values_map.get('Email Address')
                fullName = field_values_map.get('fullName') or field_values_map.get('name') or field_values_map.get('full_name') or 'User'
                
                if email:
                    send_submission_status_email(
                        email=email,
                        full_name=fullName,
                        form_name=submission.form_template.name,
                        status=new_status,
                        admin_notes=admin_notes
                    )

        if admin_notes is not None:
            submission.admin_notes = admin_notes
        
        submission.save()
        
        serializer = FormSubmissionSerializer(submission)
        return Response(serializer.data)
    except FormSubmission.DoesNotExist:
        return Response(
            {'error': 'Submission not found'},
            status=status.HTTP_404_NOT_FOUND
        )

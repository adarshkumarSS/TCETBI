from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import cloudinary.uploader

from ..models import FormTemplate, FormField, FormSubmission, FormFieldValue, Notification
from ..serializers import FormTemplateSerializer, FormSubmissionSerializer


@api_view(['GET'])
def get_form_structure(request, form_type):
    """Get form structure for public use"""
    try:
        template = FormTemplate.objects.get(form_type=form_type, is_active=True)
        serializer = FormTemplateSerializer(template)
        return Response(serializer.data)
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form not found or inactive'},
            status=status.HTTP_404_NOT_FOUND
        )


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
                folder = f"TCETBI/FormSubmissions/{form_type}"
                upload_result = cloudinary.uploader.upload(
                    file,
                    folder=folder,
                    resource_type="auto"
                )
                file_url = upload_result.get('secure_url')
                value = file.name
            
            # Create field value
            FormFieldValue.objects.create(
                submission=submission,
                field=field,
                value=str(value),
                file_url=file_url
            )
        
        # Create notification
        Notification.objects.create(
            type='general',
            title=f'New {template.name} Submission',
            message=f'A new {template.name} has been submitted.',
            meta={'submission_id': submission.id, 'form_type': form_type}
        )
        
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
            submission.status = new_status
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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from ..models import FormTemplate, FormField
from ..serializers import FormTemplateSerializer, FormFieldSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_form_templates(request):
    """List all form templates"""
    default_types = ['funding_support', 'mentoring_support', 'idea_validation', 'contact', 'incubation_application', 'company_funding_support']
    existing_types = FormTemplate.objects.values_list('form_type', flat=True)
    if any(t not in existing_types for t in default_types):
        try:
            import sys, os
            if os.path.join(os.path.dirname(__file__), '..', '..') not in sys.path:
                sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
            from utils.seed_initial_forms import seed_forms
            seed_forms()
        except Exception as e:
            print(f"Fallback seed error: {e}")
            
    templates = FormTemplate.objects.all()
    serializer = FormTemplateSerializer(templates, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_form_template(request, form_type):
    """Get specific form template with fields. Creates default if missing."""
    template = FormTemplate.objects.filter(form_type=form_type).first()
    
    if not template:
        try:
            import sys, os
            if os.path.join(os.path.dirname(__file__), '..', '..') not in sys.path:
                sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
            from utils.seed_initial_forms import seed_forms
            seed_forms()
        except Exception as e:
            print(f"Fallback seed error: {e}")

        template = FormTemplate.objects.filter(form_type=form_type).first()
        if not template:
            return Response(
                {'error': f'Invalid form type: {form_type}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    serializer = FormTemplateSerializer(template)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_form_template(request):
    """Create new form template"""
    serializer = FormTemplateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_form_template(request, template_id):
    """Update form template"""
    try:
        template = FormTemplate.objects.get(id=template_id)
        serializer = FormTemplateSerializer(template, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form template not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_form_template(request, template_id):
    """Delete form template"""
    try:
        template = FormTemplate.objects.get(id=template_id)
        template.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form template not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_form_field(request, template_id):
    """Add field to form template"""
    try:
        template = FormTemplate.objects.get(id=template_id)
        data = request.data.copy()
        data['form_template'] = template.id
        
        serializer = FormFieldSerializer(data=data)
        if serializer.is_valid():
            serializer.save(form_template=template)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form template not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_form_field(request, field_id):
    """Update form field"""
    try:
        field = FormField.objects.get(id=field_id)
        serializer = FormFieldSerializer(field, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FormField.DoesNotExist:
        return Response(
            {'error': 'Form field not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_form_field(request, field_id):
    """Delete form field"""
    try:
        field = FormField.objects.get(id=field_id)
        field.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except FormField.DoesNotExist:
        return Response(
            {'error': 'Form field not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
@transaction.atomic
def reorder_form_fields(request, template_id):
    """Reorder form fields"""
    try:
        template = FormTemplate.objects.get(id=template_id)
        field_orders = request.data.get('field_orders', [])
        
        # field_orders should be: [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...]
        for item in field_orders:
            field_id = item.get('id')
            order = item.get('order')
            FormField.objects.filter(id=field_id, form_template=template).update(order=order)
        
        # Return updated template
        serializer = FormTemplateSerializer(template)
        return Response(serializer.data)
    except FormTemplate.DoesNotExist:
        return Response(
            {'error': 'Form template not found'},
            status=status.HTTP_404_NOT_FOUND
        )

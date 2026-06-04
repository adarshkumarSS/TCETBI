from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.forms import ValidationError
from django.contrib.auth.models import User as DjangoUser
from .models import AppUser, UserCompanyRequest
from django.core.cache import cache
import os
import json

from .models import Notification, IncubationApplication, TBICEO, AppUser, UserCompanyRequest, Startup, CEO, FormSubmission, FormTemplate
from .serializers import ContactMessageSerializer, NotificationSerializer, UserRegistrationSerializer, AppUserSerializer, UserCompanyRequestSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .serializers import IncubationSerializer
import cloudinary.uploader
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from utils.cloudinary_utils import delete_cloudinary_image, delete_cloudinary_file
from .models import Mentor

@api_view(["POST"])
def submit_contact_message(request):
    print("=== CONTACT BUTTON CLICKED ===")

    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        msg = serializer.save()
        print(f"[OK] Contact message saved with ID #{msg.id}")

        # When submit button is clicked, this creates 1 notification (no email sent)
        print("[EMAIL] Creating notification only...")
        notification = Notification.objects.create(
            type="contact",
            title="New Contact Message",
            message=f"{msg.name} submitted a message: {msg.subject}",
            meta={
                "name": msg.name,
                "email": msg.email,
                "phone": msg.phone,
                "subject": msg.subject,
                "message": msg.message,
            }
        )
        print(f"[NOTIFY] LOG NOTIFICATION ONLY: #{notification.id} created (no email)")

        return Response({"message": "Message submitted successfully!"}, status=201)

    return Response({"errors": serializer.errors}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.order_by("-created_at")
    data = NotificationSerializer(notifications, many=True).data
    return Response({"notifications": data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, id):
    try:
        notif = Notification.objects.get(id=id)
        notif.is_read = True
        notif.save()
        return Response({"message": "Notification marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_notification(request, id):
    try:
        Notification.objects.get(id=id).delete()
        return Response({"message": "Deleted"})
    except Notification.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

from .utils.email_utils import send_incubation_email_to_ceo, send_approval_email, send_user_approval_email, send_submission_status_email

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_incubation(request):
    print("=== APPLICATION FORM SUBMIT BUTTON CLICKED ===")
    import uuid
    request_id = str(uuid.uuid4())[:8]
    print(f"[REQUEST {request_id}] Processing incubation application submission")

    user_email = request.data.get("email")
    unique_key = f"incubation_submit_lock:{user_email}"

    if cache.get(unique_key):
        print(f"[REQUEST {request_id}] [WARN] Duplicate request blocked for email: {user_email}")
        return Response({"message": "Duplicate request ignored"}, status=200)

    cache.set(unique_key, True, timeout=5)
    print(f"[REQUEST {request_id}] [LOCK] Cache lock set for email: {user_email}")
    # Validate PDF size (<2MB)
    resume = request.FILES.get("resume")
    if resume and resume.size > 2 * 1024 * 1024:
        return Response({"error": "Resume must be less than 2MB"}, status=400)

    profile_image = request.FILES.get("profile_image")

    profile_url = None
    resume_url = None

    if profile_image:
        upload = cloudinary.uploader.upload(profile_image)
        profile_url = upload.get("secure_url")

    if resume:
        # Use resource_type="auto" to let Cloudinary detect PDF and serve it correctly
        upload = cloudinary.uploader.upload(resume, resource_type="auto")
        resume_url = upload.get("secure_url")

    data = request.data.copy()
    data["profile_image"] = profile_url
    data["resume_pdf"] = resume_url

    # Debug: Log all received data keys and values
    print("=== ALL RECEIVED FORM DATA ===")
    for key, value in data.items():
        print(f"{key}: {value} (type: {type(value)})")
    print("=== END RECEIVED FORM DATA ===")

    # Handle references - combine separate fields into objects
    # Check if reference fields exist in the request
    ref1_exists = any(key.startswith("reference1") and data.get(key, "").strip() for key in data.keys())
    ref2_exists = any(key.startswith("reference2") and data.get(key, "").strip() for key in data.keys())

    print(f"Reference1 fields exist: {ref1_exists}")
    print(f"Reference2 fields exist: {ref2_exists}")

    if ref1_exists:
        reference1 = {
            "name": str(data.get("reference1Name", "")).strip(),
            "mobile": str(data.get("reference1Mobile", "")).strip(),
            "email": str(data.get("reference1Email", "")).strip(),
            "address": str(data.get("reference1Address", "")).strip(),
        }
        data["reference1"] = json.dumps(reference1 if any(reference1.values()) else {})
    else:
        data["reference1"] = json.dumps({})

    if ref2_exists:
        reference2 = {
            "name": str(data.get("reference2Name", "")).strip(),
            "mobile": str(data.get("reference2Mobile", "")).strip(),
            "email": str(data.get("reference2Email", "")).strip(),
            "address": str(data.get("reference2Address", "")).strip(),
        }
        data["reference2"] = json.dumps(reference2 if any(reference2.values()) else {})
    else:
        data["reference2"] = json.dumps({})

    # Remove the individual reference fields
    fields_to_remove = [
        "reference1Name", "reference1Mobile", "reference1Email", "reference1Address",
        "reference2Name", "reference2Mobile", "reference2Email", "reference2Address"
    ]
    for field in fields_to_remove:
        if field in data:
            data.pop(field, None)

    # Debug: Print reference data
    print(f"Reference1 data: {data.get('reference1', 'NOT FOUND')}")
    print(f"Reference2 data: {data.get('reference2', 'NOT FOUND')}")
    print(f"Raw POST data keys: {list(data.keys())}")

    # Save
    serializer = IncubationSerializer(data=data)

    if serializer.is_valid():
        app = serializer.save()
        print(f"[REQUEST {request_id}] [OK] Application saved with ID #{app.id}")

        # === SINGLE POINT FOR NOTIFICATION + EMAIL ===
        # When submit button is clicked, this creates 1 notification AND sends 1 email
        print(f"[REQUEST {request_id}] [EMAIL] Creating notification and sending email...")

        notification = Notification.objects.create(
            type="application",
            title=f"New Application: {app.businessName}",
            message=f"Application #{app.id} from {app.fullName} ({app.email}). Notifications sent to CEO and Admin.",
            meta={
                "application_id": app.id,
                "fullName": app.fullName,
                "businessName": app.businessName,
                "email": app.email,
            }
        )
        print(f"[REQUEST {request_id}] [NOTIFY] LOG NOTIFICATION: #{notification.id} created")

        # Automatically send email when notification is created
        send_incubation_email_to_ceo(app)
        print(f"[REQUEST {request_id}] [EMAIL] EMAIL sent to CEO for application #{app.id}")

        return Response({
            "message": "Application submitted successfully! Notification sent and email dispatched.",
            "data": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_incubation_applications(request):
    """
    Get all incubation applications. Returning FormSubmissions (dynamic) 
    instead of just IncubationApplication model to allow the admin dashboard 
    to be truly dynamic.
    """
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    submissions = FormSubmission.objects.filter(
        form_template__form_type='incubation_application'
    ).select_related('form_template', 'user').prefetch_related('field_values', 'field_values__field').order_by("is_read", "-created_at")
    
    print(f"DEBUG: Found {submissions.count()} incubation applications")
    
    from .serializers import FormSubmissionSerializer
    data = FormSubmissionSerializer(submissions, many=True).data
    
    return Response({"applications": data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_application_status(request, id):
    """
    Update incubation application status (using FormSubmission ID).
    """
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        submission = FormSubmission.objects.get(id=id)
        new_status = request.data.get("status")
        if new_status in ["pending", "approved", "rejected"]:
            old_status = submission.status
            submission.status = new_status
            submission.save()

            if new_status == "approved" and old_status != "approved":
                # Only for incubation applications
                if submission.form_template.form_type == 'incubation_application':
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
                    
                    # Also try to update the synced IncubationApplication if it exists (by search since they aren't FK'd)
                    try:
                        inc_app = IncubationApplication.objects.filter(email=email, businessName=businessName).order_by('-created_at').first()
                        if inc_app:
                            inc_app.status = 'approved'
                            inc_app.save()
                    except:
                        pass
                        
            elif new_status == "rejected" and old_status != "rejected":
                if submission.form_template.form_type == 'incubation_application':
                    admin_notes = request.data.get('admin_notes') or request.data.get('message')
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

            return Response({"message": f"Application {new_status}"})
        else:
            return Response({"error": "Invalid status"}, status=400)
    except FormSubmission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_application_as_read(request, id):
    """
    Mark an application (FormSubmission) as read.
    """
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        submission = FormSubmission.objects.get(id=id)
        submission.is_read = True
        submission.save()
        return Response({"message": "Application marked as read"})
    except FormSubmission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_application(request, id):
    """
    Delete an incubation application (FormSubmission).
    """
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        submission = FormSubmission.objects.get(id=id)
        submission.delete()
        return Response({"message": "Application deleted successfully"})
    except FormSubmission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def bulk_delete_applications(request):
    """
    Delete multiple incubation applications at once.
    Expected data: {"ids": [1, 2, 3]}
    """
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    ids = request.data.get('ids', [])
    if not ids:
        return Response({"error": "No IDs provided"}, status=400)

    try:
        submissions = FormSubmission.objects.filter(id__in=ids)
        count = submissions.count()
        submissions.delete()
        return Response({"message": f"{count} applications deleted successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Authentication Views
def create_admin_user():
    """Create admin user as AppUser instance if it doesn't exist"""
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@tcetbi.edu')
    admin_password = os.getenv('ADMIN_PASSWORD', 'Admin@123')
    try:
        if not AppUser.objects.filter(username=admin_email).exists():
            user = AppUser.objects.create_user(
                username=admin_email,
                email=admin_email,
                password=admin_password,
                full_name='Admin TCETBI',
                phone='',
                status='approved'
            )
            # Mark as admin by setting special attributes
            user.is_staff = True
            user.is_superuser = True
            user.save()
            print(f"[OK] Admin user created: {user.username} (AppUser)")
        else:
            user = AppUser.objects.get(username=admin_email)
            # Do NOT reset password here, otherwise changing it via UI won't work
            # user.set_password(admin_password) 
            user.is_staff = True
            user.is_superuser = True
            user.status = 'approved'
            user.save()
            print(f"[OK] Admin user updated: {user.username} (AppUser)")
    except Exception as e:
        print(f"[ERROR] Error creating admin user: {e}")

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

    # Create admin user if not exists
    create_admin_user()

    try:
        # Since AUTH_USER_MODEL is AppUser now, we use AppUser instead of DjangoUser
        user = AppUser.objects.get(username=email)
        if not user.check_password(password) or not user.is_staff:
            return Response({'error': 'Invalid credentials or access denied'}, status=status.HTTP_401_UNAUTHORIZED)
    except AppUser.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)
        return Response({'access': access_token})
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_logout(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_profile(request):
    user = request.user
    if not user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = AppUserSerializer(user)
    return Response({'user': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_admin_password(request):
    user = request.user
    if not user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not all([current_password, new_password, confirm_password]):
        return Response({'error': 'All password fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate new password
    from django.contrib.auth.password_validation import validate_password
    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    # Update .env file if needed
    import os
    env_file = os.path.join(os.path.dirname(__file__), '..', '.env')
    try:
        # Note: In production, you'd want a more secure way, but since it was stored in .env as requested:
        pass  # Don't update .env for security reasons
    except:
        pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_password(request):
    user = request.user
    
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not all([current_password, new_password, confirm_password]):
        return Response({'error': 'All password fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate new password
    from django.contrib.auth.password_validation import validate_password
    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.must_change_password = False # Reset the flag
    user.save()

    return Response({'message': 'Password changed successfully'})

# User Views
@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create notification for admin
        Notification.objects.create(
            type="user_registration",
            title="New User Registration",
            message=f"User {user.full_name} ({user.email}) registered and is waiting for approval.",
            meta={
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
            }
        )
        return Response({
            'message': 'Registration successful. Your account is pending admin approval.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

    # Use Django's authenticate function with our custom backend
    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check user status after authentication
    if user.status == 'pending':
        # Get CEO contact details
        ceo = TBICEO.objects.first()
        ceo_info = {}
        if ceo:
            ceo_info = {
                'name': ceo.name,
                'position': ceo.position,
                'email': ceo.email,
            }

        return Response({
            'error': 'Account pending approval',
            'message': 'Your account is waiting for admin approval. Please contact the administrator for status update.',
            'action': 'Contact admin to approve your account',
            'ceo_contact': ceo_info,
            'user_status': 'pending'
        }, status=status.HTTP_403_FORBIDDEN)

    elif user.status == 'blocked':
        # Get CEO contact details
        ceo = TBICEO.objects.first()
        ceo_info = {}
        if ceo:
            ceo_info = {
                'name': ceo.name,
                'position': ceo.position,
                'email': ceo.email,
            }

        return Response({
            'error': 'Account blocked',
            'message': 'Your account has been blocked. Please contact the administrator to unblock your account.',
            'action': 'Contact admin to unblock your account',
            'ceo_contact': ceo_info,
            'user_status': 'blocked'
        }, status=status.HTTP_403_FORBIDDEN)

    # User is approved, proceed with login
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name if hasattr(user, 'full_name') else getattr(user, 'first_name', ''),
            'must_change_password': user.must_change_password,
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    # Check if user is Django User (admin) with staff rights
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    users = AppUser.objects.all().order_by('-date_joined')
    serializer = AppUserSerializer(users, many=True)
    return Response({'users': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_status(request, user_id):
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = AppUser.objects.get(id=user_id)
        new_status = request.data.get('status')
        if new_status in ['pending', 'approved', 'blocked']:
            old_status = user.status
            user.status = new_status
            user.save()
            
            if new_status == 'approved' and old_status != 'approved':
                send_user_approval_email(user)
                
            return Response({'message': f'User status updated to {new_status}'})
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    except AppUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not (hasattr(request.user, 'is_staff') and request.user.is_staff):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = AppUser.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except AppUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_users(request):
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    users = AppUser.objects.filter(status='pending').order_by('-date_joined')
    serializer = AppUserSerializer(users, many=True)
    return Response({'users': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Set as approved since admin is creating directly
        user.status = 'approved'
        user.save()
        return Response({
            'message': 'User created successfully.',
            'user': AppUserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = AppUserSerializer(request.user)
    return Response({'user': serializer.data})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = AppUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User Company Request Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_company_request(request):
    # Get the most recent request that's not rejected, or the most recent rejected one if all are rejected
    company_requests = UserCompanyRequest.objects.filter(user=request.user).order_by('-created_at')

    # First try to find a non-rejected request
    active_request = company_requests.exclude(status='rejected').first()

    # If no active request, get the most recent rejected one
    if not active_request:
        active_request = company_requests.filter(status='rejected').first()

    # If no requests at all, check if user has an approved startup for potential edit requests
    if not active_request:
        # Check if user has any approved companies
        approved_requests = UserCompanyRequest.objects.filter(
            user=request.user,
            status='approved',
            is_edit_request=False
        ).order_by('-created_at')

        if approved_requests.exists():
            # User has approved company, return a placeholder for edit request creation
            return Response({
                'company_request': None,
                'has_approved_company': True,
                'approved_company': UserCompanyRequestSerializer(approved_requests.first()).data
            })

    if active_request:
        serializer = UserCompanyRequestSerializer(active_request)
        return Response({'company_request': serializer.data})
    else:
        return Response({'company_request': None})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_or_update_company_request(request):
    user = request.user

    # Check if user has any active (non-rejected) requests
    active_requests = UserCompanyRequest.objects.filter(
        user=user
    ).exclude(status='rejected')

    if active_requests.exists():
        # Get the most recent active request
        company_request = active_requests.order_by('-created_at').first()

        if company_request.status in ['submitted', 'approved']:
            return Response({
                'error': 'Cannot modify request while it is under review or approved. Wait for admin decision.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update existing request
        # Check for image replacements and delete old images from Cloudinary
        if 'logo' in request.data and request.data['logo'] != company_request.logo:
            delete_cloudinary_image(company_request.logo)
        
        if 'ceo_image' in request.data and request.data['ceo_image'] != company_request.ceo_image:
            delete_cloudinary_image(company_request.ceo_image)

        serializer = UserCompanyRequestSerializer(company_request, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Company details saved as draft',
                'company_request': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Check if user has rejected requests - allow editing the most recent one
        rejected_requests = UserCompanyRequest.objects.filter(
            user=user,
            status='rejected'
        ).order_by('-created_at')

        if rejected_requests.exists():
            # Get the most recent rejected request to edit
            company_request = rejected_requests.first()

            # Reset to draft status when editing
            request.data['status'] = 'draft'
            serializer = UserCompanyRequestSerializer(company_request, data=request.data, partial=True)
            if serializer.is_valid():
                company_request = serializer.save()
                return Response({
                    'message': 'Company details updated from previous rejection',
                    'company_request': serializer.data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # No requests at all - create new one
            serializer = UserCompanyRequestSerializer(data=request.data)
            if serializer.is_valid():
                company_request = serializer.save(user=user)
                return Response({
                    'message': 'Company details saved as draft',
                    'company_request': UserCompanyRequestSerializer(company_request).data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_company_request(request):
    user = request.user

    # Get the most recent draft request (should be the one user just edited)
    # First try to get draft requests, if none exist, check if user has any requests at all
    company_request = UserCompanyRequest.objects.filter(
        user=user,
        status='draft'
    ).order_by('-updated_at').first()

    # If no draft requests, check if user has any requests and get the most recent one
    if not company_request:
        company_request = UserCompanyRequest.objects.filter(
            user=user
        ).order_by('-updated_at').first()

        if not company_request:
            return Response({'error': 'No company request found. Please create a request first.'}, status=status.HTTP_400_BAD_REQUEST)

        # If the request is not draft, it might be rejected - allow resubmission
        if company_request.status != 'draft':
            company_request.status = 'draft'
            company_request.save()

    # Validate required fields
    required_fields = ['name', 'description', 'sector', 'founded', 'website', 'location']
    missing_fields = [field for field in required_fields if not getattr(company_request, field)]

    if missing_fields:
        return Response({
            'error': f'Missing required fields: {", ".join(missing_fields)}'
        }, status=status.HTTP_400_BAD_REQUEST)

    company_request.status = 'submitted'
    company_request.save()

    # Create notification for admin
    if company_request.is_edit_request:
        notification_title = f"Company Edit Request: {company_request.name}"
        notification_message = f"User {user.full_name} ({user.email}) submitted an edit request for their approved company."
    else:
        notification_title = f"New Company Portfolio Request: {company_request.name}"
        notification_message = f"User {user.full_name} ({user.email}) submitted company details for portfolio inclusion."

    Notification.objects.create(
        type="company_request",
        title=notification_title,
        message=notification_message,
        meta={
            "user_id": user.id,
            "company_request_id": company_request.id,
            "company_name": company_request.name,
            "is_edit_request": company_request.is_edit_request,
            "changes_summary": company_request.edit_changes_summary,
        }
    )

    return Response({
        'message': 'Company request submitted for review. You will be notified once reviewed.',
        'company_request': UserCompanyRequestSerializer(company_request).data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_company_edit_request(request):
    user = request.user

    # Extract the edit_changes_summary and edited data from request
    edit_changes_summary = request.data.get('edit_changes_summary', '').strip()

    if not edit_changes_summary:
        return Response({'error': 'Edit changes summary is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user has an approved company
    approved_request = UserCompanyRequest.objects.filter(
        user=user,
        status='approved',
        is_edit_request=False
    ).order_by('-created_at').first()

    if not approved_request:
        return Response({'error': 'No approved company found to edit.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already has a pending edit request
    pending_edit = UserCompanyRequest.objects.filter(
        user=user,
        is_edit_request=True,
        status__in=['draft', 'submitted']
    ).first()

    if pending_edit:
        return Response({'error': 'You already have a pending edit request.'}, status=status.HTTP_400_BAD_REQUEST)

    # Get the original startup
    original_startup = None
    if approved_request.original_startup:
        original_startup = approved_request.original_startup
    else:
        # Find the startup that was created from this request
        try:
            original_startup = Startup.objects.filter(name=approved_request.name).first()
        except:
            pass

    if not original_startup:
        return Response({'error': 'Could not find the original startup record.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create edit request data using the edited data from frontend
    edit_data = {
        'is_edit_request': True,
        'original_startup': original_startup.id,
        'edit_changes_summary': edit_changes_summary,
        # Use the edited data sent from frontend (this contains the proposed changes)
        'name': request.data.get('name', original_startup.name),
        'logo': request.data.get('logo', original_startup.logo),
        'description': request.data.get('description', original_startup.description),
        'sector': request.data.get('sector', original_startup.sector),
        'founded': request.data.get('founded', original_startup.founded),
        'website': request.data.get('website', original_startup.website),
        'location': request.data.get('location', original_startup.location),
        'linkedin': request.data.get('linkedin', original_startup.linkedin),
        'twitter': request.data.get('twitter', original_startup.twitter),
        'facebook': request.data.get('facebook', original_startup.facebook),
        'products': request.data.get('products', original_startup.products),
        'ceo_name': request.data.get('ceo_name'),
        'ceo_image': request.data.get('ceo_image'),
        'ceo_bio': request.data.get('ceo_bio'),
    }

    # Clean up empty strings to None for optional fields
    for field in ['ceo_name', 'ceo_image', 'ceo_bio', 'logo', 'description', 'website', 'linkedin', 'twitter', 'facebook']:
        if edit_data[field] == '':
            edit_data[field] = None

    # Create the edit request with the proposed changes
    serializer = UserCompanyRequestSerializer(data=edit_data)
    if serializer.is_valid():
        edit_request = serializer.save(user=user)
        return Response({
            'message': 'Edit request created successfully',
            'company_request': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_company_request(request):
    user = request.user

    # Get the most recent active (non-rejected) request
    company_request = UserCompanyRequest.objects.filter(
        user=user
    ).exclude(status='rejected').order_by('-created_at').first()

    if not company_request:
        return Response({'error': 'No active company request found'}, status=status.HTTP_404_NOT_FOUND)

    if company_request.status in ['submitted', 'approved']:
        return Response({
            'error': 'Cannot delete request while it is under review or approved.'
        }, status=status.HTTP_400_BAD_REQUEST)

    company_request.delete()
    return Response({'message': 'Company request deleted'})

# Admin Company Request Management Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_requests_admin(request):
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    requests = UserCompanyRequest.objects.filter(status='submitted').select_related('user').order_by('-created_at')
    serializer = UserCompanyRequestSerializer(requests, many=True)
    return Response({'company_requests': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_company_request(request, request_id):
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        company_request = UserCompanyRequest.objects.get(id=request_id)
    except UserCompanyRequest.DoesNotExist:
        return Response({'error': 'Company request not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')  # 'approve' or 'reject'
    remarks = request.data.get('remarks', '')

    if action not in ['approve', 'reject']:
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

    if action == 'approve':
        try:
            if company_request.is_edit_request and company_request.original_startup:
                # This is an edit request - update existing startup
                startup = company_request.original_startup

                # Update startup fields
                startup.name = company_request.name
                startup.logo = company_request.logo or ''
                startup.description = company_request.description or ''
                startup.sector = company_request.sector
                startup.founded = company_request.founded
                startup.website = company_request.website or ''
                startup.location = company_request.location
                startup.linkedin = company_request.linkedin or ''
                startup.twitter = company_request.twitter or ''
                startup.facebook = company_request.facebook or ''
                startup.products = company_request.products
                startup.save()

                # Update or create CEO
                if company_request.ceo_name:
                    CEO.objects.update_or_create(
                        startup=startup,
                        defaults={
                            'name': company_request.ceo_name,
                            'image': company_request.ceo_image or '',
                            'bio': company_request.ceo_bio or ''
                        }
                    )
                else:
                    # Remove CEO if not provided in edit
                    startup.ceos.all().delete()

                message_title = "Company Edit Request Approved"
                message_text = f"Your edit request for '{company_request.name}' has been approved and the portfolio has been updated."
            else:
                # This is a new company request - create new startup
                startup = Startup.objects.create(
                    name=company_request.name,
                    logo=company_request.logo or '',
                    description=company_request.description or '',
                    sector=company_request.sector,
                    founded=company_request.founded,
                    website=company_request.website or '',
                    location=company_request.location,
                    linkedin=company_request.linkedin or '',
                    twitter=company_request.twitter or '',
                    facebook=company_request.facebook or '',
                    products=company_request.products,
                    category='current'  # Default to current startup
                )

                # Create CEO if provided
                if company_request.ceo_name:
                    CEO.objects.create(
                        startup=startup,
                        name=company_request.ceo_name,
                        image=company_request.ceo_image or '',
                        bio=company_request.ceo_bio or ''
                    )

                message_title = "Company Portfolio Request Approved"
                message_text = f"Your company portfolio request for '{company_request.name}' has been approved and added to the TCE-TBI website."

            company_request.status = 'approved'
            company_request.admin_notes = remarks
            company_request.save()

            # Create notification for user
            Notification.objects.create(
                type="company_request",
                title=message_title,
                message=message_text,
                meta={
                    "company_request_id": company_request.id,
                    "startup_id": startup.id,
                    "company_name": company_request.name,
                    "is_edit_request": company_request.is_edit_request,
                }
            )

            return Response({
                'message': 'Company request approved and portfolio updated',
                'company_request': UserCompanyRequestSerializer(company_request).data
            })

        except Exception as e:
            return Response({'error': f'Failed to process request: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif action == 'reject':
        company_request.status = 'rejected'
        company_request.admin_notes = remarks
        company_request.save()

        # Create notification for user
        Notification.objects.create(
            type="company_request",
            title="Company Portfolio Request Rejected",
            message=f"Your company portfolio request for '{company_request.name}' has been rejected.",
            meta={
                "company_request_id": company_request.id,
                "company_name": company_request.name,
                "rejection_reason": remarks,
            }
        )

        return Response({
            'message': 'Company request rejected',
            'company_request': UserCompanyRequestSerializer(company_request).data
        })

# Support Services ViewSets
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Mentor, FundingRequest, MentoringRequest, ValidationRequest
from .serializers import MentorSerializer, FundingRequestSerializer, MentoringRequestSerializer, ValidationRequestSerializer

def send_mentor_status_email(mentor):
    """Send email notification to mentor about their application status."""
    try:
        if not mentor.email:
            return

        subject = f"Mentor Application Status - TCETBI"
        status_text = "approved" if mentor.status == 'approved' else "under review"
        if mentor.status == 'rejected':
            status_text = "rejected"
            
        html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #1976d2;">Mentor Application Status Update</h2>
            <p>Dear {mentor.salutation} {mentor.name},</p>
            <p>Thank you for your interest in mentoring at TCETBI.</p>
            <p>Your application status has been updated to: <strong>{mentor.status.title()}</strong>.</p>
            {"<p>Congratulations! Your profile is now live on our platform. We look forward to your contributions to the startup ecosystem.</p>" if mentor.status == 'approved' else ""}
            {"<p>We regret to inform you that your application has been rejected at this time. We will keep your details on file for future opportunities.</p>" if mentor.status == 'rejected' else ""}
            <p>Best regards,<br>The TCETBI Team</p>
        </div>
        """
        
        plain_text = f"Dear {mentor.salutation} {mentor.name}, Your mentor application at TCETBI is now {mentor.status}. Best regards, TCETBI Team"
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=os.getenv('DEFAULT_FROM_EMAIL'),
            to=[mentor.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        print(f"[EMAIL] Mentor status email sent to {mentor.email}")
    except Exception as e:
        print(f"[ERROR] Failed to send mentor status email: {e}")

class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user is authenticated admin (from PUT/PATCH/DELETE with authenticator),
        # show all mentors. For unauthenticated GET, show only approved.
        if user.is_authenticated and user.is_staff:
            return Mentor.objects.all().order_by('-created_at')
        return Mentor.objects.filter(status='approved').order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]

    def get_authenticators(self):
        # Skip authenticators for public-facing methods (GET, POST)
        # This prevents expired/invalid tokens from causing 401 errors
        # Admin operations (PUT, PATCH, DELETE) require proper auth
        if self.request.method in ('GET', 'POST'):
            return []
        return super().get_authenticators()

    def list(self, request, *args, **kwargs):
        """Override list to manually try auth for admin users"""
        # Try to manually authenticate the request for GET calls
        # so admin users can see all mentors (including pending)
        from rest_framework_simplejwt.authentication import JWTAuthentication
        try:
            auth = JWTAuthentication()
            result = auth.authenticate(request)
            if result:
                request.user, request.auth = result
        except Exception:
            pass  # Not authenticated or token invalid — just proceed as anonymous
        
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        print("=== MENTOR CREATE REQUEST ===")
        print(f"Data received: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("!!! SERIALIZER ERRORS !!!")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        try:
            print("--- Creating Mentor ---")
            print(f"Data: {self.request.data}")
            
            # Check if the request is from an admin user
            is_admin = False
            from rest_framework_simplejwt.authentication import JWTAuthentication
            try:
                auth = JWTAuthentication()
                result = auth.authenticate(self.request)
                if result and result[0].is_staff:
                    is_admin = True
            except Exception:
                pass
            
            # Admin-created mentors are auto-approved if specified; public applications are pending
            status_sent = self.request.data.get('status')
            if is_admin:
                mentor_status = status_sent if status_sent in ['approved', 'pending', 'rejected'] else 'approved'
            else:
                mentor_status = 'pending'
                
            mentor = serializer.save(status=mentor_status)
            print(f"Mentor created: {mentor.id} (status: {mentor_status}, admin: {is_admin})")
            
            if mentor_status == 'pending':
                # Only notify admin for pending applications
                Notification.objects.create(
                    type="mentor",
                    title="New Mentor Application",
                    message=f"{mentor.salutation} {mentor.name} has applied as a mentor.",
                    meta={
                        "mentor_id": mentor.id,
                        "name": mentor.name,
                        "email": mentor.email,
                        "domain": mentor.domain
                    }
                )
                print("Notification created for pending application")
        except Exception as e:
            print(f"!!! Error in MentorViewSet.perform_create: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        mentor = serializer.save()
        
        if mentor.status != old_status:
            send_mentor_status_email(mentor)

class FundingRequestViewSet(viewsets.ModelViewSet):
    queryset = FundingRequest.objects.all()
    serializer_class = FundingRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return FundingRequest.objects.all().order_by('-created_at')
        return FundingRequest.objects.filter(user=user).order_by('-created_at')

    def perform_update(self, serializer):
        instance = self.get_object()
        new_pitch_deck = serializer.validated_data.get('pitch_deck')
        if new_pitch_deck and instance.pitch_deck and new_pitch_deck != instance.pitch_deck:
            delete_cloudinary_file(instance.pitch_deck, resource_type='raw')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.pitch_deck:
            delete_cloudinary_file(instance.pitch_deck, resource_type='raw')
        instance.delete()

class MentoringRequestViewSet(viewsets.ModelViewSet):
    queryset = MentoringRequest.objects.all()
    serializer_class = MentoringRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return MentoringRequest.objects.all().order_by('-created_at')
        return MentoringRequest.objects.filter(user=user).order_by('-created_at')

class ValidationRequestViewSet(viewsets.ModelViewSet):
    queryset = ValidationRequest.objects.all()
    serializer_class = ValidationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return super().get_authenticators()
    queryset = ValidationRequest.objects.all()
    serializer_class = ValidationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ValidationRequest.objects.all().order_by('-created_at')
        return ValidationRequest.objects.filter(user=user).order_by('-created_at')


# =========================================================================
# Site Settings (Feature Flags)
# =========================================================================
from .models import SiteSettings

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def site_settings_view(request):
    """Get or update site-wide settings (admin only)."""
    if not request.user.is_staff:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    settings = SiteSettings.load()

    if request.method == "GET":
        return Response({
            "email_enabled": settings.email_enabled,
            "google_sso_enabled": settings.google_sso_enabled,
        })

    if request.method == "PUT":
        if "email_enabled" in request.data:
            settings.email_enabled = request.data["email_enabled"]
        if "google_sso_enabled" in request.data:
            settings.google_sso_enabled = request.data["google_sso_enabled"]
        settings.save()
        return Response({
            "email_enabled": settings.email_enabled,
            "google_sso_enabled": settings.google_sso_enabled,
            "message": "Settings updated successfully"
        })


# =========================================================================
# Admin Password Reset
# =========================================================================
import secrets

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_reset_user_password(request, user_id):
    """Admin resets a user's password to a secure temporary one."""
    if not request.user.is_staff:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = AppUser.objects.get(id=user_id)
    except AppUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Generate secure temporary password
    temp_password = secrets.token_urlsafe(12)
    user.set_password(temp_password)
    user.must_change_password = True
    user.save()

    # Optionally send email with new password
    send_reset_email = request.data.get("send_email", False)
    if send_reset_email and user.email:
        from .utils.gmail_service import send_html_email
        login_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8080')}/auth"
        send_html_email(
            to=[user.email],
            subject="Password Reset - TCETBI Portal",
            html_body=f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #1976d2;">Password Reset</h2>
                <p>Dear {user.full_name or user.username},</p>
                <p>Your password has been reset by the administrator.</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>New Temporary Password:</strong> <code>{temp_password}</code></p>
                    <p style="color: #d32f2f; font-size: 14px;"><em>You will be required to change this password on your next login.</em></p>
                </div>
                <a href="{login_url}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Login Now</a>
                <p style="margin-top: 30px;">Best regards,<br>TCETBI Team</p>
            </div>
            """,
            plain_body=f"Your password has been reset. New temporary password: {temp_password}. Login at {login_url}",
        )

    return Response({
        "message": "Password reset successfully",
        "temporary_password": temp_password,
        "user_email": user.email,
        "must_change_password": True,
    })


# =========================================================================
# Google SSO Login
# =========================================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def google_sso_login(request):
    """Authenticate user via Google OAuth2 ID token."""
    credential = request.data.get("credential")
    if not credential:
        return Response({"error": "Google credential is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if SSO is enabled
    try:
        settings = SiteSettings.load()
        if not settings.google_sso_enabled:
            return Response({"error": "Google SSO is currently disabled"}, status=status.HTTP_403_FORBIDDEN)
    except Exception:
        pass

    # Verify token with Google
    from .utils.google_auth import verify_google_token
    google_user = verify_google_token(credential)
    if not google_user:
        return Response({"error": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)

    email = google_user["email"]
    name = google_user.get("name", "")
    picture = google_user.get("picture", "")

    # Find or create user
    user = AppUser.objects.filter(email=email).first()
    if not user:
        # Also check by username (email-based)
        user = AppUser.objects.filter(username=email).first()

    if user:
        # Existing user — check status
        if user.status == 'blocked':
            return Response({"error": "Your account has been blocked"}, status=status.HTTP_403_FORBIDDEN)
    else:
        # Create new user via Google SSO
        user = AppUser.objects.create_user(
            username=email,
            email=email,
            full_name=name,
            profile_image=picture,
            status='approved',  # Google-verified users are auto-approved
            must_change_password=False,
        )
        # Set unusable password since they use Google
        user.set_unusable_password()
        user.save()

        # Create notification
        Notification.objects.create(
            type="user_registration",
            title="New Google SSO User",
            message=f"{name} ({email}) signed up via Google SSO.",
            meta={"user_id": user.id, "email": email, "name": name}
        )

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name or name,
            "profile_image": user.profile_image or picture,
            "is_staff": user.is_staff,
            "status": user.status,
            "must_change_password": user.must_change_password,
        }
    })


# =========================================================================
# Google SSO Status (public endpoint - needed by auth page)
# =========================================================================
@api_view(["GET"])
@permission_classes([AllowAny])
def google_sso_status(request):
    """Check if Google SSO is enabled (public)."""
    try:
        settings = SiteSettings.load()
        client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        return Response({
            "enabled": settings.google_sso_enabled and bool(client_id),
            "client_id": client_id if settings.google_sso_enabled else "",
        })
    except Exception:
        return Response({"enabled": False, "client_id": ""})


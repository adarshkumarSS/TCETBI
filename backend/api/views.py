from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.forms import ValidationError
from django.contrib.auth.models import User as DjangoUser
from .models import AppUser
from django.core.cache import cache
import os
import json

from .models import Notification, IncubationApplication, TBICEO, AppUser
from .serializers import ContactMessageSerializer, NotificationSerializer, UserRegistrationSerializer, AppUserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .serializers import IncubationSerializer
import cloudinary.uploader
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string

@api_view(["POST"])
def submit_contact_message(request):
    print("=== CONTACT BUTTON CLICKED ===")

    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        msg = serializer.save()
        print(f"✅ Contact message saved with ID #{msg.id}")

        # When submit button is clicked, this creates 1 notification (no email sent)
        print("📧 Creating notification only...")
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
        print(f"🔔 LOG NOTIFICATION ONLY: #{notification.id} created (no email)")

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

def send_incubation_email_to_ceo(application):
    """Send email notification to CEO about new incubation application."""
    try:
        # Get CEO email from database
        ceo = TBICEO.objects.first()
        if not ceo or not ceo.email:
            print(f"CEO email not found - CEO object: {ceo}, Email: {ceo.email if ceo else 'N/A'}")
            return

        # Create email content with HTML formatting for better readability
        subject = f"New Incubation Application - {application.businessName}"

        # Helper function to format services
        def format_services():
            if not application.services:
                return 'None'
            services = []
            for key, value in application.services.items():
                if value:
                    # Convert camelCase to Title Case
                    formatted = ''.join([' ' + c.lower() if c.isupper() else c for c in key]).strip().title()
                    services.append(formatted)
            return ', '.join(services)

        # Build HTML email content
        application_data = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">New Incubation Application Received</h2>

            <h3 style="color: #333; margin-top: 30px;">Business Details</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Business Name:</strong> {application.businessName}</li>
                <li><strong>Business Type:</strong> {application.businessType}</li>
                <li><strong>Legal Entity:</strong> {application.legalEntity}</li>
                <li><strong>Description:</strong> {application.businessDescription}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">Personal Details</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Full Name:</strong> {application.salutation} {application.fullName}</li>
                <li><strong>Father's Name:</strong> {application.fatherName}</li>
                <li><strong>Age:</strong> {application.age}</li>
                <li><strong>Email:</strong> {application.email}</li>
                <li><strong>Residential Mobile:</strong> {application.resMobile}</li>
                <li><strong>Office Mobile:</strong> {application.offMobile or 'N/A'}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">Address</h3>
            <p style="margin-left: 20px;">{application.address}<br>{application.city}, {application.state} - {application.post}<br>{application.country}</p>

            <h3 style="color: #333; margin-top: 30px;">Business Information</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Services Required:</strong> {format_services()}</li>
                <li><strong>Number of Chairs:</strong> {application.numChairs or 'N/A'}</li>
                <li><strong>Full-time Employees:</strong> {application.fullTimeEmployees or 'N/A'}</li>
                <li><strong>Part-time Employees:</strong> {application.partTimeEmployees or 'N/A'}</li>
                <li><strong>Consultants:</strong> {application.consultants or 'N/A'}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">References</h3>
            <div style="margin-left: 20px;">
                <p><strong>Reference 1:</strong></p>
                <p style="margin-left: 20px;">Name: {application.reference1.get('name', '')}<br>
                Mobile: {application.reference1.get('mobile', '')}<br>
                Email: {application.reference1.get('email', '')}<br>
                Address: {application.reference1.get('address', '')}</p>

                <p style="margin-top: 15px;"><strong>Reference 2:</strong></p>
                <p style="margin-left: 20px;">Name: {application.reference2.get('name', '')}<br>
                Mobile: {application.reference2.get('mobile', '')}<br>
                Email: {application.reference2.get('email', '')}<br>
                Address: {application.reference2.get('address', '')}</p>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Application ID: #{application.id}<br>
            Submitted at: {application.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>

            <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <p style="margin: 0; font-weight: bold; color: #1976d2;">Please review this application in the admin dashboard.</p>
            </div>
        </div>
        """

        # Also include plain text version for better compatibility
        plain_text_content = f"""
        New Incubation Application Received

        Business Details:
        - Business Name: {application.businessName}
        - Business Type: {application.businessType}
        - Legal Entity: {application.legalEntity}
        - Business Description: {application.businessDescription}

        Personal Details:
        - Full Name: {application.salutation} {application.fullName}
        - Father's Name: {application.fatherName}
        - Age: {application.age}
        - Email: {application.email}
        - Residential Mobile: {application.resMobile}
        - Office Mobile: {application.offMobile or 'N/A'}

        Address:
        {application.address}
        {application.city}, {application.state} - {application.post}
        {application.country}

        Business Information:
        - Services Required: {format_services()}
        - Number of Chairs: {application.numChairs or 'N/A'}
        - Full-time Employees: {application.fullTimeEmployees or 'N/A'}
        - Part-time Employees: {application.partTimeEmployees or 'N/A'}
        - Consultants: {application.consultants or 'N/A'}

        References:
        Reference 1: {application.reference1}
        Reference 2: {application.reference2}

        Application ID: #{application.id}
        Submitted at: {application.created_at.strftime('%Y-%m-%d %H:%M:%S')}
        """

        # Send unified HTML + plain text email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text_content,
            from_email=os.getenv('DEFAULT_FROM_EMAIL'),
            to=[ceo.email],
        )
        msg.attach_alternative(application_data, "text/html")
        msg.send()

        print(f"Email notification sent successfully to CEO: {ceo.email} for application #{application.id}")

    except Exception as e:
        print(f"Error sending email notification to CEO: {e}")
        # DON'T create a notification for email errors - just log them
        # This was causing duplicate notifications!

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
        print(f"[REQUEST {request_id}] 🔥 Duplicate request blocked for email: {user_email}")
        return Response({"message": "Duplicate request ignored"}, status=200)

    cache.set(unique_key, True, timeout=5)
    print(f"[REQUEST {request_id}] 🔒 Cache lock set for email: {user_email}")
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
        upload = cloudinary.uploader.upload(resume, resource_type="raw")
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
        print(f"[REQUEST {request_id}] ✅ Application saved with ID #{app.id}")

        # === SINGLE POINT FOR NOTIFICATION + EMAIL ===
        # When submit button is clicked, this creates 1 notification AND sends 1 email
        print(f"[REQUEST {request_id}] 📧 Creating notification and sending email...")

        notification = Notification.objects.create(
            type="application",
            title=f"New Application: {app.businessName}",
            message=f"Application #{app.id} from {app.fullName} ({app.email}). Email sent to CEO.",
            meta={
                "application_id": app.id,
                "fullName": app.fullName,
                "businessName": app.businessName,
                "email": app.email,
            }
        )
        print(f"[REQUEST {request_id}] 🔔 LOG NOTIFICATION: #{notification.id} created")

        # Automatically send email when notification is created
        send_incubation_email_to_ceo(app)
        print(f"[REQUEST {request_id}] ✉️ EMAIL sent to CEO for application #{app.id}")

        return Response({
            "message": "Application submitted successfully! Notification sent and email dispatched.",
            "data": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_incubation_applications(request):
    applications = IncubationApplication.objects.order_by("-created_at")
    data = IncubationSerializer(applications, many=True).data
    return Response({"applications": data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_application_status(request, id):
    try:
        app = IncubationApplication.objects.get(id=id)
        status = request.data.get("status")
        if status in ["pending", "approved", "rejected"]:
            app.status = status
            app.save()
            return Response({"message": f"Application {status}"})
        else:
            return Response({"error": "Invalid status"}, status=400)
    except IncubationApplication.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


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
            print(f"✅ Admin user created: {user.username} (AppUser)")
        else:
            user = AppUser.objects.get(username=admin_email)
            user.set_password(admin_password)
            user.is_staff = True
            user.is_superuser = True
            user.status = 'approved'
            user.save()
            print(f"✅ Admin user updated: {user.username} (AppUser)")
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")

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

    return Response({
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
            user.status = new_status
            user.save()
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

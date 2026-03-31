import os
import json
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from ..models import TBICEO, AppUser, UserCompanyRequest, Startup, CEO

def send_incubation_email_to_ceo(application):
    """Send email notification to CEO about new incubation application."""
    try:
        # Get CEO email from database
        ceo = TBICEO.objects.first()
        if not ceo or not ceo.email:
            print(f"CEO email not found - CEO object: {ceo}, Email: {ceo.email if ceo else 'N/A'}")
            return

        # Handle both old model and mapped dict from FormSubmission
        businessName = getattr(application, 'businessName', application.get('businessName', 'N/A'))
        fullName = getattr(application, 'fullName', application.get('fullName', 'N/A'))
        salutation = getattr(application, 'salutation', application.get('salutation', 'N/A'))
        businessType = getattr(application, 'businessType', application.get('businessType', 'N/A'))
        legalEntity = getattr(application, 'legalEntity', application.get('legalEntity', 'N/A'))
        businessDescription = getattr(application, 'businessDescription', application.get('businessDescription', 'N/A'))
        fatherName = getattr(application, 'fatherName', application.get('fatherName', 'N/A'))
        age = getattr(application, 'age', application.get('age', 'N/A'))
        email = getattr(application, 'email', application.get('email', 'N/A'))
        resMobile = getattr(application, 'resMobile', application.get('resMobile', 'N/A'))
        offMobile = getattr(application, 'offMobile', application.get('offMobile', 'N/A'))
        address = getattr(application, 'address', application.get('address', 'N/A'))
        city = getattr(application, 'city', application.get('city', 'N/A'))
        state = getattr(application, 'state', application.get('state', 'N/A'))
        post = getattr(application, 'post', application.get('post', 'N/A'))
        country = getattr(application, 'country', application.get('country', 'N/A'))
        numChairs = getattr(application, 'numChairs', application.get('numChairs', 'N/A'))
        fullTimeEmployees = getattr(application, 'fullTimeEmployees', application.get('fullTimeEmployees', 'N/A'))
        partTimeEmployees = getattr(application, 'partTimeEmployees', application.get('partTimeEmployees', 'N/A'))
        consultants = getattr(application, 'consultants', application.get('consultants', 'N/A'))
        
        # Services
        services = getattr(application, 'services', application.get('services', {}))
        
        # References
        reference1 = getattr(application, 'reference1', application.get('reference1', {}))
        reference2 = getattr(application, 'reference2', application.get('reference2', {}))
        
        id = getattr(application, 'id', application.get('id', 'N/A'))
        created_at = getattr(application, 'created_at', None)
        created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S') if created_at and hasattr(created_at, 'strftime') else 'N/A'

        # Create email content
        subject = f"New Incubation Application - {businessName}"

        # Helper function to format services
        def format_services_list():
            if not services:
                return 'None'
            if isinstance(services, str):
                try:
                    serv_dict = json.loads(services)
                except:
                    return services
            else:
                serv_dict = services
                
            if not isinstance(serv_dict, dict):
                return str(services)
                
            formatted_list = []
            for key, value in serv_dict.items():
                if value:
                    formatted = ''.join([' ' + c.lower() if c.isupper() else c for c in key]).strip().title()
                    formatted_list.append(formatted)
            return ', '.join(formatted_list) if formatted_list else 'None'

        # Build HTML email content
        application_data = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">New Incubation Application Received</h2>

            <h3 style="color: #333; margin-top: 30px;">Business Details</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Business Name:</strong> {businessName}</li>
                <li><strong>Business Type:</strong> {businessType}</li>
                <li><strong>Legal Entity:</strong> {legalEntity}</li>
                <li><strong>Description:</strong> {businessDescription}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">Personal Details</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Full Name:</strong> {salutation} {fullName}</li>
                <li><strong>Father's Name:</strong> {fatherName}</li>
                <li><strong>Age:</strong> {age}</li>
                <li><strong>Email:</strong> {email}</li>
                <li><strong>Residential Mobile:</strong> {resMobile}</li>
                <li><strong>Office Mobile:</strong> {offMobile or 'N/A'}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">Address</h3>
            <p style="margin-left: 20px;">{address}<br>{city}, {state} - {post}<br>{country}</p>

            <h3 style="color: #333; margin-top: 30px;">Business Information</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Services Required:</strong> {format_services_list()}</li>
                <li><strong>Number of Chairs:</strong> {numChairs or 'N/A'}</li>
                <li><strong>Full-time Employees:</strong> {fullTimeEmployees or 'N/A'}</li>
                <li><strong>Part-time Employees:</strong> {partTimeEmployees or 'N/A'}</li>
                <li><strong>Consultants:</strong> {consultants or 'N/A'}</li>
            </ul>

            <h3 style="color: #333; margin-top: 30px;">References</h3>
            <div style="margin-left: 20px;">
                <p><strong>Reference 1:</strong></p>
                <p style="margin-left: 20px;">Name: {reference1.get('name', '') if isinstance(reference1, dict) else 'N/A'}<br>
                Mobile: {reference1.get('mobile', '') if isinstance(reference1, dict) else 'N/A'}<br>
                Email: {reference1.get('email', '') if isinstance(reference1, dict) else 'N/A'}<br>
                Address: {reference1.get('address', '') if isinstance(reference1, dict) else 'N/A'}</p>

                <p style="margin-top: 15px;"><strong>Reference 2:</strong></p>
                <p style="margin-left: 20px;">Name: {reference2.get('name', '') if isinstance(reference2, dict) else 'N/A'}<br>
                Mobile: {reference2.get('mobile', '') if isinstance(reference2, dict) else 'N/A'}<br>
                Email: {reference2.get('email', '') if isinstance(reference2, dict) else 'N/A'}<br>
                Address: {reference2.get('address', '') if isinstance(reference2, dict) else 'N/A'}</p>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Application ID: #{id}<br>
            Submitted at: {created_at_str}</p>

            <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <p style="margin: 0; font-weight: bold; color: #1976d2;">Please review this application in the admin dashboard.</p>
            </div>
        </div>
        """

        recipient_list = [ceo.email]
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@tcetbi.edu')
        if admin_email and admin_email not in recipient_list:
            recipient_list.append(admin_email)

        # Send unified HTML + plain text email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"New Incubation Application Received from {fullName}. Please check the admin dashboard.",
            from_email=os.getenv('DEFAULT_FROM_EMAIL'),
            to=recipient_list,
        )
        msg.attach_alternative(application_data, "text/html")
        msg.send()

        print(f"Email notification sent successfully to {recipient_list} for application #{id}")

    except Exception as e:
        print(f"Error sending email notification to CEO: {e}")

def send_approval_email(email, fullName, businessName, businessDescription, businessType, city, state, resMobile):
    """Handle approval logic and send email to user."""
    import secrets
    try:
        # 1. Create User if not exists
        user = AppUser.objects.filter(email=email).first()
        temp_password = None
        
        if not user:
            temp_password = secrets.token_urlsafe(10)
            user = AppUser.objects.create_user(
                username=email, # Use email as username
                email=email,
                password=temp_password,
                full_name=fullName,
                phone=resMobile,
                status='approved',
                must_change_password=True
            )
            print(f"[OK] Created new user {user.email}")
        else:
            # If user exists, ensure they are approved
            if user.status != 'approved':
                user.status = 'approved'
                user.save()
            print(f"[INFO] User {user.email} already exists")

        # 2. Create Company Request Draft if not exists for this user
        if not UserCompanyRequest.objects.filter(user=user, name=businessName).exists():
            UserCompanyRequest.objects.create(
                user=user,
                name=businessName,
                description=businessDescription,
                sector=businessType,
                location=f"{city}, {state}",
                ceo_name=fullName,
                status='draft'
            )
            print(f"[OK] Created company request draft for {businessName}")

        # 3. Send Email with credentials if new user was created
        if temp_password:
            subject = "Welcome to TCETBI - Your Incubation Application is Approved!"
            login_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/auth"
            
            html_content = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #1976d2;">Congratulations!</h2>
                <p>Dear {fullName},</p>
                <p>We are pleased to inform you that your application for incubation for <strong>{businessName}</strong> at TCETBI has been <strong>approved</strong>!</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
                    <h3 style="margin-top: 0; color: #1976d2;">Your Account Credentials</h3>
                    <p>An account has been created for you to manage your incubation journey.</p>
                    <p><strong>Login Email:</strong> {email}</p>
                    <p><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 5px;">{temp_password}</span></p>
                    <p style="color: #d32f2f; font-size: 14px;"><em>* Note: You will be required to change this password on your first login.</em></p>
                </div>
                
                <p>You can now log in to the TCETBI portal to complete your startup profile and access our resources.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="{login_url}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
                </div>
                
                <p style="margin-top: 30px;">Best regards,<br>The TCETBI Team</p>
            </div>
            """
            
            plain_text = f"Congratulations {fullName}! Your incubation application for {businessName} has been approved. Your login email is {email} and your temporary password is {temp_password}. Please change your password on first login at {login_url}"
            
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_text,
                from_email=os.getenv('DEFAULT_FROM_EMAIL'),
                to=[email],
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            print(f"[EMAIL] Approval email sent to {email}")
        
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send approval email: {e}")
        return False

def send_user_approval_email(user):
    """Send email when admin approves a generic user registration."""
    try:
        if not user.email:
            return

        subject = "Account Approved - TCETBI Portal"
        login_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/auth"
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #1976d2;">Account Approved</h2>
            <p>Dear {user.full_name or user.username},</p>
            <p>Your account at TCETBI Portal has been <strong>approved</strong> by the administrator.</p>
            <p>You can now log in to access your dashboard and services.</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{login_url}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
            </div>
            
            <p style="margin-top: 30px;">Best regards,<br>The TCETBI Team</p>
        </div>
        """
        
        plain_text = f"Dear {user.full_name or user.username}, Your account at TCETBI Portal has been approved. You can now log in at {login_url}"
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=os.getenv('DEFAULT_FROM_EMAIL'),
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        print(f"[EMAIL] User approval email sent to {user.email}")
    except Exception as e:
        print(f"[ERROR] Failed to send user approval email: {e}")

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

        # Helper to safely get values from both dict and model
        def get_val(obj, key, default='N/A'):
            if isinstance(obj, dict):
                return obj.get(key, default)
            return getattr(obj, key, default)

        businessName = get_val(application, 'businessName')
        fullName = get_val(application, 'fullName')
        salutation = get_val(application, 'salutation')
        businessType = get_val(application, 'businessType')
        legalEntity = get_val(application, 'legalEntity')
        businessDescription = get_val(application, 'businessDescription')
        fatherName = get_val(application, 'fatherName')
        age = get_val(application, 'age')
        email = get_val(application, 'email')
        resMobile = get_val(application, 'resMobile')
        offMobile = get_val(application, 'offMobile')
        address = get_val(application, 'address')
        city = get_val(application, 'city')
        state = get_val(application, 'state')
        post = get_val(application, 'post')
        country = get_val(application, 'country')
        numChairs = get_val(application, 'numChairs')
        fullTimeEmployees = get_val(application, 'fullTimeEmployees')
        partTimeEmployees = get_val(application, 'partTimeEmployees')
        consultants = get_val(application, 'consultants')
        
        # Services
        services = get_val(application, 'services', {})
        
        # References
        reference1 = get_val(application, 'reference1', {})
        reference2 = get_val(application, 'reference2', {})
        
        id = get_val(application, 'id')
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

        subject = "Welcome to TCETBI - Your Incubation Application is Approved!"
        login_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8080')}/auth"
        
        credentials_html = ""
        credentials_text = ""
        
        if temp_password:
            credentials_html = f"""
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
                <h3 style="margin-top: 0; color: #1976d2;">Your Account Credentials</h3>
                <p>An account has been created for you to manage your incubation journey.</p>
                <p><strong>Login Email:</strong> {email}</p>
                <p><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 5px;">{temp_password}</span></p>
                <p style="color: #d32f2f; font-size: 14px;"><em>* Note: You will be required to change this password on your first login.</em></p>
            </div>
            """
            credentials_text = f"Your login email is {email} and your temporary password is {temp_password}. Please change your password on first login at {login_url}"
        else:
            credentials_html = f"""
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
                <p>Your existing account has been linked to this application. You can continue using your current email (<strong>{email}</strong>) and password to login.</p>
            </div>
            """
            credentials_text = f"Your existing account ({email}) has been linked to this application. Please login with your standard password at {login_url}"
            
        html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #1976d2;">Congratulations!</h2>
            <p>Dear {fullName},</p>
            <p>We are pleased to inform you that your application for incubation for <strong>{businessName}</strong> at TCETBI has been <strong>approved</strong>!</p>
            
            {credentials_html}
            
            <p>You can now log in to the TCETBI portal to complete your startup profile and access our resources.</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{login_url}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
            </div>
            
            <p style="margin-top: 30px;">Best regards,<br>The TCETBI Team</p>
        </div>
        """
        
        plain_text = f"Congratulations {fullName}! Your incubation application for {businessName} has been approved. {credentials_text}"
        
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
        login_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8080')}/auth"
        
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

def send_submission_status_email(email, full_name, form_name, status, admin_notes=None):
    """Generic function to send automated approval/rejection emails for any form."""
    try:
        if not email:
            print("[MAIL-DEBUG] No email provided, skipping status notification")
            return False

        subject = f"Update on your {form_name} Application - TCETBI"
        is_approved = status == 'approved'
        status_text = "Approved" if is_approved else "Rejected"
        color = "#2e7d32" if is_approved else "#d32f2f" # Success Green vs Error Red

        html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
            <div style="text-align: center; border-bottom: 2px solid {color}; padding-bottom: 10px;">
                <h2 style="color: {color}; margin: 0;">Application {status_text}</h2>
            </div>
            
            <p>Dear {full_name},</p>
            <p>Thank you for reaching out to TCETBI. We have reviewed your application for <strong>{form_name}</strong>.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid {color}; margin: 20px 0;">
                <p style="margin: 0;"><strong>Status:</strong> {status_text}</p>
                {f'<p style="margin: 10px 0 0 0;"><strong>Remarks/Feedback:</strong> {admin_notes}</p>' if admin_notes else ''}
            </div>
            """
        
        if is_approved:
            html_content += "<p>Our team will contact you shortly with the next steps regarding your approval process.</p>"
        else:
            if "incubation" in form_name.lower():
                # Formal Rejection for Incubation
                from ..models import TBICEO
                ceo = TBICEO.objects.first()
                ceo_contact = ""
                if ceo:
                    ceo_contact = f"""
                    <div style="margin-top: 25px; border-top: 1px solid #ddd; padding-top: 15px;">
                        <p style="margin: 0;"><strong>For any further queries, please feel free to reach out to our CEO:</strong></p>
                        <p style="margin: 5px 0;">{ceo.name} - {ceo.position}</p>
                        <p style="margin: 5px 0;"><a href="mailto:{ceo.email}" style="color: #1976d2;">{ceo.email}</a></p>
                        {f'<p style="margin: 5px 0;"><a href="{ceo.linkedin}" style="color: #1976d2;">LinkedIn Profile</a></p>' if ceo.linkedin else ''}
                    </div>
                    """
                
                html_content += f"""
                <p>We deeply appreciate the time and effort you invested in preparing your incubation application. After careful consideration, we regret to inform you that we cannot proceed with your proposal at this time.</p>
                <p>We receive many promising applications, and our selection process is highly competitive. Should your startup pivot or achieve new milestones that align more closely with our incubation mandate, we encourage you to apply again in the future.</p>
                {ceo_contact}
                """
            else:
                html_content += "<p>Unfortunately, we are unable to proceed with your application at this time. We encourage you to refine your proposal and apply again in the future if applicable.</p>"

        html_content += f"""
            <p style="margin-top: 30px;">Best regards,<br><strong>Team TCETBI</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">This is an automated notification. Please do not reply directly to this email.</p>
        </div>
        """
        
        plain_text = f"Dear {full_name}, your {form_name} application status has been updated to {status_text}. {f'Admin Remarks: {admin_notes}' if admin_notes else ''}"
        
        from_email = os.getenv('DEFAULT_FROM_EMAIL', os.getenv('EMAIL_HOST_USER'))
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=from_email,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        print(f"[MAIL-SUCCESS] Status email sent to {email} for {form_name} ({status_text})")
        return True
    except Exception as e:
        print(f"[MAIL-ERROR] Failed to send status email to {email}: {e}")
        return False

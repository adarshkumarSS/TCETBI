from time import timezone
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_otp_email(user_email, otp_code):
    try:
        subject = 'Your OTP for Account Verification'
        message = f'''
        Hello,

        Your OTP for account verification is: {otp_code}
        
        This OTP will expire in 10 minutes.

        Best regards,
        Admin Team (zainadarsh@gmail.com)
        '''
        
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user_email]
        
        # Log the email attempt
        logger.info(f"Attempting to send OTP email to {user_email} from {from_email}")
        logger.info(f"OTP Code: {otp_code}")
        
        # Try to send email
        result = send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        
        logger.info(f"Email sent successfully? Messages sent: {result}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        logger.error(f"Email settings - Host: {settings.EMAIL_HOST}, User: {settings.EMAIL_HOST_USER}")
        return False

def send_admin_notification(new_user_email):
    """
    Optional: Send notification to both admins when new user registers
    """
    try:
        subject = 'New User Registration'
        message = f'''
        A new user has registered and is awaiting OTP verification:
        
        Email: {new_user_email}
        Time: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}
        
        Please monitor the system for any issues.
        '''
        
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = ['zainadarsh@gmail.com', 'admin@tce.tci']  # Both admins
        
        send_mail(subject, message, from_email, recipient_list)
        return True
    except Exception as e:
        logger.error(f"Failed to send admin notification: {e}")
        return False
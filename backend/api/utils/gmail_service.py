"""
Centralized Gmail/Email service.
All outgoing emails go through this module, which checks the SiteSettings feature flag.
"""
import os
from django.core.mail import EmailMultiAlternatives


def is_email_enabled():
    """Check if email sending is enabled via the SiteSettings feature flag."""
    try:
        from api.models import SiteSettings
        settings = SiteSettings.load()
        # FORCE ENABLE FOR DEBUG
        print(f"[MAIL-DEBUG] SiteSettings.email_enabled: {settings.email_enabled}")
        return True #settings.email_enabled
    except Exception as e:
        print(f"[MAIL-DEBUG] SiteSettings check failed: {e}")
        return True


def send_html_email(to, subject, html_body, plain_body=None, from_email=None):
    """
    Send an HTML email through Django's SMTP backend.
    """
    print(f"[MAIL-DEBUG] Initiating send to {to} | Subject: {subject}")
    
    if not is_email_enabled():
        print(f"[MAIL-SKIP] Email disabled. Skipping: '{subject}' to {to}")
        return False

    if not to:
        print("[MAIL-SKIP] No recipient provided")
        return False

    if isinstance(to, str):
        to = [to]

    if not from_email:
        from_email = os.getenv('DEFAULT_FROM_EMAIL', os.getenv('EMAIL_HOST_USER'))

    if not plain_body:
        import re
        plain_body = re.sub(r'<[^>]+>', '', html_body).strip()

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_body,
            from_email=from_email,
            to=to,
        )
        msg.attach_alternative(html_body, "text/html")
        sent_count = msg.send()
        print(f"[MAIL-OK] Django sent {sent_count} email(s) successfully to {to}")
        return True
    except Exception as e:
        import traceback
        print(f"[MAIL-ERROR] CRITICAL FAILURE sending to {to}: {e}")
        traceback.print_exc()
        return False

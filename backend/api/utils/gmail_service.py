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
        return settings.email_enabled
    except Exception:
        # If the table doesn't exist yet (pre-migration), default to True
        return True


def send_html_email(to, subject, html_body, plain_body=None, from_email=None):
    """
    Send an HTML email through Django's SMTP backend.
    Checks the feature flag before sending.
    
    Args:
        to: list of recipient emails or single email string
        subject: email subject line
        html_body: HTML content
        plain_body: plain text fallback (auto-generated if not provided)
        from_email: sender email (defaults to DEFAULT_FROM_EMAIL env var)
    
    Returns:
        True if sent, False if skipped or failed
    """
    if not is_email_enabled():
        print(f"[MAIL-SKIP] Email disabled by admin. Skipping: '{subject}' to {to}")
        return False

    if not to:
        print("[MAIL-SKIP] No recipient provided")
        return False

    if isinstance(to, str):
        to = [to]

    if not from_email:
        from_email = os.getenv('DEFAULT_FROM_EMAIL', os.getenv('EMAIL_HOST_USER'))

    if not plain_body:
        # Strip HTML tags for a basic plain text version
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
        msg.send()
        print(f"[MAIL-OK] Sent '{subject}' to {to}")
        return True
    except Exception as e:
        print(f"[MAIL-ERROR] Failed to send '{subject}' to {to}: {e}")
        return False

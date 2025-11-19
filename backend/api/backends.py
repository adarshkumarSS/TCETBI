from django.contrib.auth.backends import BaseBackend
from .models import AppUser

class MultiModelAuthBackend(BaseBackend):
    """Custom authentication backend for AppUser model"""

    def authenticate(self, request, username=None, password=None, **kwargs):
        # When AUTH_USER_MODEL is AppUser, we handle all authentication through AppUser
        if username and password:
            try:
                user = AppUser.objects.get(username=username)
                if user.check_password(password):
                    # For admin users, check if they have is_staff set
                    if user.is_staff:
                        return user
                    # For regular users, check if they're approved
                    elif user.status == 'approved':
                        return user
            except AppUser.DoesNotExist:
                pass

        return None

    def get_user(self, user_id):
        try:
            user = AppUser.objects.get(pk=user_id)
            # Allow admin users to access any endpoint, approved users only if they have approved status
            if user.is_staff or user.status == 'approved':
                return user
        except AppUser.DoesNotExist:
            pass
        return None

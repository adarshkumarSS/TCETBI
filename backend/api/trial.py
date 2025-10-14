from django.contrib.auth import get_user_model
User = get_user_model()

# Delete the existing user
try:
    user = User.objects.get(email="your_email@example.com")  # Use the email you tried
    user.delete()
    print("User deleted successfully")
except User.DoesNotExist:
    print("User not found")
except Exception as e:
    print(f"Error: {e}")
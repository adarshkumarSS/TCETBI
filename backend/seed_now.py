import os
import django
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import and run the seed script
try:
    from utils.seed_initial_forms import seed_forms
    seed_forms()
    print("SUCCESS: Seeds planted!")
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()

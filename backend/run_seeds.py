import os
import django
import sys

# Add the current directory and the utils directory to sys.path
sys.path.append(os.getcwd())

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def run():
    try:
        django.setup()
        from utils.seed_initial_forms import seed_forms
        print("🌱 Starting form seeding...")
        seed_forms()
        print("\n✅ SUCCESS: Form templates and fields are registered.")
    except Exception as e:
        print(f"\n❌ FAILURE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    run()

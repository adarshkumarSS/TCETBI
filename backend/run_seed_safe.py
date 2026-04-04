import os
import sys
import django

# Set up Django environment manually without running manage.py shell
sys.path.insert(0, r"d:\TCETBI\backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from utils.seed_initial_forms import seed_forms
seed_forms()

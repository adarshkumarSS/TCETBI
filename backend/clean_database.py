#!/usr/bin/env python3
"""
clean_database.py
-----------------
Truncates (empties) all database tables and clears Cloudinary storage,
then re-seeds initial data from utils.seed_data.

⚠️ Use with caution — this will delete ALL data and images!
"""

import os
import sys
import django

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
from django.apps import apps
from django.db import connection, transaction
import cloudinary
import cloudinary.api
from utils.seed_data import seed
from utils.seed_portfolio import seed_portfolio
from utils.seed_people import seed_people
from utils.seed_facility import seed_facilities
from utils.seed_events import seed_events
from utils.seed_media import seed_media

from utils.seed_blog import seed_blogs
from utils.seed_support import seed_support
from utils.seed_mentors import seed_mentors
from utils.seed_partnerships import seed_partnerships
from utils.seed_users import seed_users
from utils.seed_initial_forms import seed_forms
# ✅ Load Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# ✅ Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def clear_cloudinary(folder_prefix="TCETBI"):
    """Deletes all resources from the given Cloudinary folder prefix."""
    print("\n🧹 Clearing Cloudinary storage...")

    try:
        # Get all resources recursively in the specified folder (includes PDFs)
        resources = cloudinary.api.resources(type="upload", prefix=folder_prefix, max_results=500)
        raw_resources = cloudinary.api.resources(type="upload", prefix=folder_prefix, resource_type="raw", max_results=500)

        # Get all resource IDs
        public_ids = [res["public_id"] for res in resources.get("resources", [])]
        raw_public_ids = [res["public_id"] for res in raw_resources.get("resources", [])]

        all_public_ids = public_ids + raw_public_ids

        if not all_public_ids:
            print("⚠️ No Cloudinary resources found to delete.")
            return

        # Batch delete all resources
        result = cloudinary.api.delete_resources(all_public_ids)
        deleted = result.get("deleted", {})

        print(f"✅ Deleted {len(deleted)} images and PDFs from Cloudinary.")
    except Exception as e:
        print(f"❌ Failed to clear Cloudinary resources: {e}")


def truncate_all_tables():
    """Truncate all tables safely (without dropping schema)."""
    print("\n🚨 WARNING: This will delete ALL DATA from the database!")
    confirm = input("Type 'YES' to continue: ")
    if confirm != "YES":
        print("❌ Operation cancelled.")
        return False

    with connection.cursor() as cursor:
        print("\n🧹 Truncating all tables...")
        with transaction.atomic():
            # Collect all table names
            tables = [f'"{model._meta.db_table}"' for model in apps.get_models()]
            if tables:
                # Truncate all tables in a single command with CASCADE
                sql = f"TRUNCATE TABLE {', '.join(tables)} RESTART IDENTITY CASCADE;"
                cursor.execute(sql)
                print(f"✅ Cleared {len(tables)} tables successfully.")

    print("\n🎯 All tables truncated successfully!")
    return True


if __name__ == "__main__":
    if truncate_all_tables():
        clear_cloudinary("TCETBI")  # ✅ Clears all Cloudinary uploads from this project
        seed()  
        seed_portfolio() 
        seed_people() 
        seed_facilities() 
        seed_events()
        seed_media() 
 
        seed_blogs()
        seed_support()
        seed_mentors()
        seed_partnerships()
        seed_users()
        seed_forms()
        print("\n🚀 Database and Cloudinary refreshed successfully!")

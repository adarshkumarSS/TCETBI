#!/usr/bin/env python3
"""
clean_database.py
-----------------
Truncates (empties) all database tables and clears Cloudinary storage,
then re-seeds initial data from utils.seed_data.

⚠️ Use with caution — this will delete ALL data and images!
"""

import os
import django
from django.apps import apps
from django.db import connection, transaction
import cloudinary
import cloudinary.api
from utils.seed_data import seed
from utils.seed_portfolio import seed_portfolio
from utils.seed_people import seed_people
from utils.seed_facility import seed_facilities
from utils.seed_programs import seed_programs
from utils.seed_media import seed_media

from utils.seed_blog import seed_blogs
from utils.seed_support import seed_support
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
            # Disable foreign key checks
            cursor.execute("SET session_replication_role = 'replica';")

            for model in apps.get_models():
                table_name = model._meta.db_table
                try:
                    cursor.execute(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE;')
                    print(f"✅ Cleared: {table_name}")
                except Exception as e:
                    print(f"⚠️ Skipped {table_name}: {e}")

            # Re-enable constraints
            cursor.execute("SET session_replication_role = 'origin';")

    print("\n🎯 All tables truncated successfully!")
    return True


if __name__ == "__main__":
    if truncate_all_tables():
        clear_cloudinary("TCETBI")  # ✅ Clears all Cloudinary uploads from this project
        seed()  
        seed_portfolio() 
        seed_people() 
        seed_facilities() 
        seed_programs()
        seed_media() 
 
        seed_blogs()
        seed_support()
        print("\n🚀 Database and Cloudinary refreshed successfully!")

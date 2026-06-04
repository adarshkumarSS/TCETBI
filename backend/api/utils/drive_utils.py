from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import os
import json

# Token file path (same directory as this file)
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'drive_token.json')

def get_drive_service():
    """Build and return Google Drive service using OAuth2 token."""
    token_path = os.path.normpath(TOKEN_FILE)
    creds = None
    token_json_env = os.getenv('GOOGLE_DRIVE_TOKEN_JSON')
    
    # 1. Try to load token from environment variable first (for production/cloud)
    if token_json_env:
        try:
            token_json_env = token_json_env.strip()
            if (token_json_env.startswith("'") and token_json_env.endswith("'")) or \
               (token_json_env.startswith('"') and token_json_env.endswith('"')):
                token_json_env = token_json_env[1:-1]
            token_info = json.loads(token_json_env)
            creds = Credentials.from_authorized_user_info(token_info,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
        except Exception as env_err:
            print(f"[ERROR] Failed to load Drive credentials from GOOGLE_DRIVE_TOKEN_JSON: {env_err}")

    # 2. Fall back to drive_token.json file if env variable is not set
    if not creds:
        if not os.path.exists(token_path):
            print(f"[ERROR] Drive token not found at {token_path} and GOOGLE_DRIVE_TOKEN_JSON is not set.")
            print("[FIX] Run: python setup_drive_oauth.py")
            return None
            
        try:
            creds = Credentials.from_authorized_user_file(token_path,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
        except Exception as file_err:
            print(f"[ERROR] Failed to load Drive credentials from file: {file_err}")
            return None
            
    try:
        # Refresh token if expired
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            # Save back to file only if we loaded it from the file
            if not token_json_env and os.path.exists(token_path):
                try:
                    with open(token_path, 'w') as f:
                        f.write(creds.to_json())
                except Exception as write_err:
                    print(f"[WARN] Failed to write refreshed token to file: {write_err}")
        
        if not creds or not creds.valid:
            print("[ERROR] Drive credentials are invalid. Run: python setup_drive_oauth.py")
            return None
            
        return build('drive', 'v3', credentials=creds)
    except Exception as e:
        print(f"[ERROR] Failed to initialize Drive service: {e}")
        return None

def upload_to_drive(file_obj, filename, folder_id=None):
    """
    Upload a Django file object to Google Drive.
    Returns: (web_view_link, file_id) or (None, None)
    """
    service = get_drive_service()
    if not service:
        return None, None
        
    try:
        if not folder_id:
            folder_id = os.getenv('GOOGLE_DRIVE_FOLDER_ID', '').strip().strip('"').strip("'")

        file_metadata = {'name': filename}
        if folder_id:
            file_metadata['parents'] = [folder_id]

        # Determine mimetype
        ext = filename.split('.')[-1].lower() if '.' in filename else ''
        mime_map = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'csv': 'text/csv',
            'zip': 'application/zip',
        }
        mimetype = mime_map.get(ext, 'application/octet-stream')

        media = MediaIoBaseUpload(
            file_obj, 
            mimetype=mimetype, 
            resumable=True
        )
        
        result = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()
        
        file_id = result.get('id')
        
        # Make file readable by anyone with the link
        try:
            service.permissions().create(
                fileId=file_id,
                body={'type': 'anyone', 'role': 'reader'}
            ).execute()
        except Exception as perm_err:
            print(f"[DRIVE] Warning: Could not set public permission: {perm_err}")
            
        return result.get('webViewLink'), file_id
        
    except Exception as e:
        print(f"[ERROR] Drive Upload failed: {e}")
        return None, None

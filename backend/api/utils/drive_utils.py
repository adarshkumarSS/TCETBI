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
    
    if not os.path.exists(token_path):
        print(f"[ERROR] Drive token not found at {token_path}")
        print("[FIX] Run: python setup_drive_oauth.py")
        return None
        
    try:
        creds = Credentials.from_authorized_user_file(token_path,
            scopes=['https://www.googleapis.com/auth/drive.file']
        )
        
        # Refresh token if expired
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(token_path, 'w') as f:
                f.write(creds.to_json())
        
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

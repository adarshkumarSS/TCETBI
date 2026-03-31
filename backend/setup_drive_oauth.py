import os
import json
import io
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/drive.file']
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'drive_token.json')

def setup_oauth():
    """Run this ONCE to authenticate with your Google account via browser."""
    print("=" * 60)
    print("GOOGLE DRIVE - OAuth2 Setup")
    print("=" * 60)
    
    client_config_json = os.getenv('GOOGLE_DRIVE_OAUTH_CREDENTIALS')
    if not client_config_json:
        print("[ERROR] GOOGLE_DRIVE_OAUTH_CREDENTIALS not found in .env")
        print()
        print("To fix this:")
        print("1. Go to https://console.cloud.google.com/apis/credentials?project=tbinew")
        print("2. Click 'Create Credentials' > 'OAuth client ID'")
        print("3. Application type: 'Desktop app'")
        print("4. Download the JSON")
        print("5. Copy its contents into GOOGLE_DRIVE_OAUTH_CREDENTIALS in your .env")
        return
    
    client_config_json = client_config_json.strip()
    if (client_config_json.startswith("'") and client_config_json.endswith("'")) or \
       (client_config_json.startswith('"') and client_config_json.endswith('"')):
        client_config_json = client_config_json[1:-1]
    
    client_config = json.loads(client_config_json)
    
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    creds = flow.run_local_server(port=8090)
    
    # Save the token
    with open(TOKEN_FILE, 'w') as f:
        f.write(creds.to_json())
    
    print(f"[SUCCESS] Token saved to {TOKEN_FILE}")
    print("You can now upload files to Google Drive!")
    
    # Test it
    service = build('drive', 'v3', credentials=creds)
    about = service.about().get(fields='user').execute()
    print(f"[OK] Authenticated as: {about['user']['emailAddress']}")
    
    # Test upload
    folder_id = os.getenv('GOOGLE_DRIVE_FOLDER_ID', '').strip().strip('"').strip("'")
    test_content = b"TCETBI test upload - OAuth2 working!"
    file_stream = io.BytesIO(test_content)
    file_metadata = {'name': 'TCETBI_oauth_test.txt'}
    if folder_id:
        file_metadata['parents'] = [folder_id]
    
    media = MediaIoBaseUpload(file_stream, mimetype='text/plain', resumable=True)
    result = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink'
    ).execute()
    
    print(f"[SUCCESS] Test file uploaded: {result.get('webViewLink')}")
    
    # Clean up
    service.files().delete(fileId=result.get('id')).execute()
    print("[OK] Test file cleaned up")

if __name__ == "__main__":
    setup_oauth()

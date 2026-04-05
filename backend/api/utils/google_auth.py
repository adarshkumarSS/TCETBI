"""
Google OAuth2 token verification utility.
Validates Google ID tokens and extracts user information.
"""
import os
import requests


GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"


def verify_google_token(id_token):
    """
    Verify a Google ID token and return user info.
    
    Uses Google's tokeninfo endpoint to validate the token,
    which doesn't require any additional Python library.
    
    Args:
        id_token: The Google credential (JWT) from the frontend
        
    Returns:
        dict with keys: email, name, picture, email_verified
        None if verification fails
    """
    try:
        # Validate with Google's tokeninfo endpoint
        response = requests.get(
            GOOGLE_TOKEN_INFO_URL,
            params={"id_token": id_token},
            timeout=10
        )

        if response.status_code != 200:
            print(f"[GOOGLE-AUTH] Token verification failed: {response.status_code}")
            return None

        payload = response.json()

        # Verify the audience (client ID) matches our app
        expected_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        if expected_client_id and payload.get("aud") != expected_client_id:
            print(f"[GOOGLE-AUTH] Token audience mismatch: {payload.get('aud')} != {expected_client_id}")
            return None

        # Check email is verified
        if payload.get("email_verified") != "true":
            print(f"[GOOGLE-AUTH] Email not verified for {payload.get('email')}")
            return None

        return {
            "email": payload.get("email"),
            "name": payload.get("name", ""),
            "picture": payload.get("picture", ""),
            "email_verified": True,
        }

    except requests.RequestException as e:
        print(f"[GOOGLE-AUTH] Network error verifying token: {e}")
        return None
    except Exception as e:
        print(f"[GOOGLE-AUTH] Unexpected error: {e}")
        return None

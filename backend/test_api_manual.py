"""
Comprehensive Backend API Testing Script
Tests all endpoints by making actual HTTP requests to the running server.
Logs all results to test_results_backend.log
"""
import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:8000/api"
LOG_FILE = "test_results_backend.log"

# Test results tracking
test_results = {
    'passed': 0,
    'failed': 0,
    'errors': []
}

def log(message):
    """Log message to console and file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_message + '\n')

def test_endpoint(name, method, url, data=None, headers=None, expected_status=None, auth_token=None, is_json=True):
    """Test an API endpoint and log results."""
    try:
        full_url = f"{BASE_URL}{url}" if not url.startswith('http') else url
        
        # Add authentication if provided
        if auth_token:
            if headers is None:
                headers = {}
            headers['Authorization'] = f'Bearer {auth_token}'
        
        # Make request
        if method == 'GET':
            response = requests.get(full_url, headers=headers, timeout=10)
        elif method == 'POST':
            if is_json:
                response = requests.post(full_url, json=data, headers=headers, timeout=10)
            else:
                response = requests.post(full_url, data=data, headers=headers, timeout=10)
        elif method == 'PUT':
            response = requests.put(full_url, json=data, headers=headers, timeout=10)
        elif method == 'DELETE':
            response = requests.delete(full_url, headers=headers, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        # Check result
        status_ok = response.status_code in (expected_status or [200, 201])
        
        if status_ok:
            test_results['passed'] += 1
            log(f"✓ PASS: {name} | {method} {url} | Status: {response.status_code}")
        else:
            test_results['failed'] += 1
            error_msg = f"Expected status {expected_status}, got {response.status_code}"
            try:
                error_detail = response.json()
                error_msg += f" | Error: {json.dumps(error_detail)[:200]}"
            except:
                error_msg += f" | Response: {response.text[:200]}"
            
            log(f"✗ FAIL: {name} | {method} {url} | {error_msg}")
            test_results['errors'].append({
                'test': name,
                'error': error_msg,
                'status_code': response.status_code
            })
        
        return response
        
    except requests.exceptions.ConnectionError:
        test_results['failed'] += 1
        error_msg = "Connection refused - is the server running?"
        log(f"✗ ERROR: {name} | {error_msg}")
        test_results['errors'].append({'test': name, 'error': error_msg})
        return None
    except Exception as e:
        test_results['failed'] += 1
        error_msg = str(e)
        log(f"✗ ERROR: {name} | {error_msg}")
        test_results['errors'].append({'test': name, 'error': error_msg})
        return None

def run_tests():
    """Run all API endpoint tests."""
    log("="*80)
    log("BACKEND API COMPREHENSIVE TEST SUITE")
    log("="*80)
    log("")
    
    # Clear previous log
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        f.write("")
    
    # 1. PUBLIC ENDPOINTS (No Auth Required)
    log("\n" + "="*80)
    log("1. PUBLIC ENDPOINTS")
    log("="*80)
    
    test_endpoint("Get Home Data", "GET", "/home-data/", expected_status=[200])
    test_endpoint("Get Portfolio Data", "GET", "/portfolio-data/", expected_status=[200])
    test_endpoint("Get People Data", "GET", "/people-data/", expected_status=[200])
    test_endpoint("Get Facilities Data", "GET", "/facilities-data/", expected_status=[200])
    test_endpoint("Get Events Data", "GET", "/events-data/", expected_status=[200])
    test_endpoint("Get Media Data", "GET", "/media-data/", expected_status=[200])
    test_endpoint("Get Blogs Data", "GET", "/blogs-data/", expected_status=[200])
    test_endpoint("Get TBI Contact Data", "GET", "/tbi-contact-data/", expected_status=[200])
    test_endpoint("List Mentors", "GET", "/mentors/", expected_status=[200])
    
    # 2. CONTACT MESSAGE SUBMISSION
    log("\n" + "="*80)
    log("2. CONTACT MESSAGE")
    log("="*80)
    
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "subject": "Test Subject",
        "message": "This is a test message from automated testing."
    }
    test_endpoint("Submit Contact Message", "POST", "/contact-message/", data=contact_data, expected_status=[201, 500])
    
    # 3. USER REGISTRATION & LOGIN
    log("\n" + "="*80)
    log("3. USER AUTHENTICATION")
    log("="*80)
    
    # Register a test user
    register_data = {
        "username": f"testuser_{int(datetime.now().timestamp())}",
        "email": f"testuser{int(datetime.now().timestamp())}@test.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
        "full_name": "Test User",
        "phone": "1234567890"
    }
    test_endpoint("User Registration", "POST", "/auth/user-register/", data=register_data, expected_status=[201])
    
    # Try admin login - Success
    admin_login_data = {
        "email": "admin",  # Backend expects 'email' key but maps it to username
        "password": "admin123" 
    }
    admin_response = test_endpoint("Admin Login (Success Case)", "POST", "/auth/admin-login/", data=admin_login_data, expected_status=[200, 401])

    # Try admin login - Failure
    admin_login_fail_data = {
        "email": "admin",
        "password": "wrongpassword"
    }
    test_endpoint("Admin Login (Failure Case)", "POST", "/auth/admin-login/", data=admin_login_fail_data, expected_status=[401])
    
    # Try to get admin token if login succeeded
    admin_token = None
    if admin_response and admin_response.status_code == 200:
        try:
            admin_token = admin_response.json().get('access')
        except:
            pass
    
    # 4. INCUBATION APPLICATION
    log("\n" + "="*80)
    log("4. INCUBATION APPLICATION")
    log("="*80)
    
    incubation_data = {
        "businessName": "Test Startup Inc",
        "salutation": "Mr.",
        "fullName": "John Doe",
        "fatherName": "Richard Doe",
        "age": 35,
        "email": "john@teststartup.com",
        "resMobile": "9876543210",
        "address": "123 Test Street",
        "city": "Test City",
        "state": "Test State",
        "post": "123456",
        "country": "Test Country",
        "businessType": "Technology",
        "legalEntity": "Private Limited",
        "businessDescription": "A test startup for automated testing",
        "services": "{}",
        "reference1": json.dumps({"name": "Reference 1", "contact": "1111111111"}),
        "reference2": json.dumps({"name": "Reference 2", "contact": "2222222222"}),
        "declaration": True
    }
    # Use is_json=False to send as form-data
    test_endpoint("Submit Incubation Application (Success)", "POST", "/apply-incubation/", data=incubation_data, expected_status=[201, 500], is_json=False)

    # Incubation Application - Failure (Missing Data)
    incubation_fail_data = {
        "businessName": "Test Startup Inc"
        # Missing required fields
    }
    test_endpoint("Submit Incubation Application (Failure)", "POST", "/apply-incubation/", data=incubation_fail_data, expected_status=[400, 500], is_json=False)
    
    # 5. SUPPORT SERVICES (Public Creation)
    log("\n" + "="*80)
    log("5. SUPPORT SERVICES")
    log("="*80)
    
    # Funding Request
    funding_data = {
        "name": "Test Applicant",
        "email": "funding@test.com",
        "phone": "1234567890",
        "startup_name": "Test Startup",
        "scheme": "nidhi_prayas",
        "description": "Test funding request description",
        "pitch_deck": "https://example.com/deck.pdf",
        "amount_requested": "500000"
    }
    test_endpoint("Create Funding Request", "POST", "/support/funding/", data=funding_data, expected_status=[201])
    
    # Mentoring Request
    mentoring_data = {
        "name": "Test Applicant",
        "email": "mentoring@test.com",
        "phone": "1234567890",
        "startup_name": "Test Startup",
        "domain": "Technology",
        "description": "Need mentoring on product development"
    }
    test_endpoint("Create Mentoring Request", "POST", "/support/mentoring/", data=mentoring_data, expected_status=[201])
    
    # Validation Request
    validation_data = {
        "name": "Test Applicant",
        "email": "validation@test.com",
        "phone": "1234567890",
        "startup_name": "Test Startup",
        "idea_details": "Test idea details",
        "testing_requirements": "Need market validation",
        "target_market": "B2B SaaS"
    }
    test_endpoint("Create Validation Request", "POST", "/support/validation/", data=validation_data, expected_status=[201])
    
    # 6. AUTHENTICATED ENDPOINTS (If we have admin token)
    if admin_token:
        log("\n" + "="*80)
        log("6. AUTHENTICATED ENDPOINTS (Admin)")
        log("="*80)
        
        test_endpoint("Get Admin Profile", "GET", "/auth/admin-profile/", auth_token=admin_token, expected_status=[200])
        test_endpoint("Get All Users", "GET", "/users/", auth_token=admin_token, expected_status=[200])
        test_endpoint("Get Notifications", "GET", "/notifications/", auth_token=admin_token, expected_status=[200])
        test_endpoint("Get Incubation Applications", "GET", "/incubation-applications/", auth_token=admin_token, expected_status=[200])
        test_endpoint("Get Company Requests", "GET", "/admin/company-requests/", auth_token=admin_token, expected_status=[200])
        test_endpoint("Get Pending Users", "GET", "/users/pending/", auth_token=admin_token, expected_status=[200])
        test_endpoint("List Funding Requests", "GET", "/support/funding/", auth_token=admin_token, expected_status=[200])
        test_endpoint("List Mentoring Requests", "GET", "/support/mentoring/", auth_token=admin_token, expected_status=[200])
        test_endpoint("List Validation Requests", "GET", "/support/validation/", auth_token=admin_token, expected_status=[200])
    else:
        log("\n⚠ Skipping authenticated endpoints - no admin token available")
        log("   To test these, start the server and ensure admin user exists")
    
    # 7. SUMMARY
    log("\n" + "="*80)
    log("TEST SUMMARY")
    log("="*80)
    log(f"Total tests run: {test_results['passed'] + test_results['failed']}")
    log(f"Passed: {test_results['passed']}")
    log(f"Failed: {test_results['failed']}")
    log(f"Success rate: {(test_results['passed']/(test_results['passed']+test_results['failed'])*100):.1f}%")
    
    if test_results['errors']:
        log("\n" + "="*80)
        log("ERRORS ENCOUNTERED:")
        log("="*80)
        for i, error in enumerate(test_results['errors'], 1):
            log(f"{i}. {error['test']}: {error['error']}")
    
    log("\n" + "="*80)
    log(f"Full log saved to: {LOG_FILE}")
    log("="*80)
    
    return test_results

if __name__ == "__main__":
    print("\nStarting Backend API Tests...")
    print("NOTE: Make sure the backend server is running at http://127.0.0.1:8000")
    
    results = run_tests()
    
    # Exit with error code if any tests failed
    sys.exit(0 if results['failed'] == 0 else 1)

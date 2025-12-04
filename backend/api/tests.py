"""
Comprehensive API endpoint tests using Django's TestCase.
This uses Django's built-in test framework for better compatibility.
"""
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import (
    Startup, CEO, BoardMember, Facility, Program, Blog, MediaItem,
    Notification, IncubationApplication, UserCompanyRequest, Mentor,
    FundingRequest, MentoringRequest, ValidationRequest, AppUser, TBICEO
)
import json


class AuthenticationTests(TestCase):
    """Test authentication endpoints."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.admin_user = AppUser.objects.create_superuser(
            username='admin_test',
            email='admin@test.com',
            password='AdminPass123!',
            is_staff=True,
            is_superuser=True,
            status='approved'
        )
        self.regular_user = AppUser.objects.create_user(
            username='user_test',
            email='user@test.com',
            password='UserPass123!',
            full_name='Test User',
            phone='1234567890',
            status='approved'
        )

    def test_admin_login_success(self):
        """Test successful admin login."""
        url = reverse('admin_login')
        data = {'username': 'admin_test', 'password': 'AdminPass123!'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials."""
        url = reverse('admin_login')
        data = {'username': 'wrong', 'password': 'wrong'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_register_invalid_email(self):
        """Test user registration with invalid email format."""
        url = reverse('user_register')
        data = {
            'username': 'bademail',
            'email': 'not-an-email',
            'password': 'Pass123!',
            'password_confirm': 'Pass123!',
            'full_name': 'Bad Email User',
            'phone': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_register_password_mismatch(self):
        """Test user registration with password mismatch."""
        url = reverse('user_register')
        data = {
            'username': 'mismatch',
            'email': 'mismatch@test.com',
            'password': 'Pass123!',
            'password_confirm': 'DifferentPass123!',
            'full_name': 'Mismatch User',
            'phone': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test user login."""
        url = reverse('user_login')
        data = {'username': 'user_test', 'password': 'UserPass123!'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class HomeDataTests(TestCase):
    """Test home data endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = AppUser.objects.create_superuser(
            username='admin', email='admin@test.com', password='pass',
            status='approved'
        )
        refresh = RefreshToken.for_user(self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_get_home_data(self):
        """Test getting home data."""
        url = reverse('get_home_data')
        self.client.credentials()  # Remove auth for public endpoint
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_home_data_unauthorized(self):
        """Test updating home data without admin token."""
        url = reverse('update_home_data')
        self.client.credentials()  # Remove auth
        data = {'visionMission': {'vision': 'Test'}}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_home_data(self):
        """Test updating home data as admin."""
        url = reverse('update_home_data')
        data = {
            'visionMission': {'vision': 'Test', 'mission': 'Test'},
            'achievements': [],
            'govtLogos': [],
            'stateLogos': [],
            'successStories': []
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PortfolioTests(TestCase):
    """Test portfolio endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.startup = Startup.objects.create(
            name='Test Startup',
            logo='https://test.com/logo.png',
            description='Test desc',
            sector='Tech',
            founded='2020',
            website='https://test.com',
            location='Test City',
            category='current'
        )

    def test_get_portfolio_data(self):
        """Test getting portfolio data."""
        url = reverse('get_portfolio_data')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ContactTests(TestCase):
    """Test contact endpoints."""

    def setUp(self):
        self.client = APIClient()

    def test_submit_contact_message(self):
        """Test submitting contact message."""
        url = reverse('submit_contact_message')
        data = {
            'name': 'Test User',
            'email': 'test@test.com',
            'phone': '1234567890',
            'subject': 'Test',
            'message': 'Test message'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_submit_contact_message_invalid(self):
        """Test submitting contact message with missing fields."""
        url = reverse('submit_contact_message')
        data = {
            'name': 'Test User'
            # Missing email, message etc
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserManagementTests(TestCase):
    """Test user management endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.admin = AppUser.objects.create_superuser(
            username='admin', email='admin@test.com', password='pass',
            status='approved'
        )
        self.user = AppUser.objects.create_user(
            username='user', email='user@test.com', password='pass',
            status='pending'
        )
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_get_users(self):
        """Test getting all users as admin."""
        url = reverse('get_users')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)

    def test_get_users_unauthorized(self):
        """Test getting users as non-admin."""
        self.client.force_authenticate(user=self.user)
        url = reverse('get_users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_user_status(self):
        """Test updating user status."""
        url = reverse('update_user_status', kwargs={'user_id': self.user.id})
        data = {'status': 'approved'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.status, 'approved')


class MentorTests(TestCase):
    """Test mentor endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.mentor = Mentor.objects.create(
            name='Test Mentor',
            domain='Tech',
            image='https://test.com/mentor.png',
            bio='Test bio'
        )

    def test_list_mentors(self):
        """Test listing mentors."""
        url = '/api/mentors/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SupportServicesTests(TestCase):
    """Test support service endpoints."""

    def setUp(self):
        self.client = APIClient()

    def test_create_funding_request(self):
        """Test creating funding request."""
        url = '/api/support/funding/'
        data = {
            'name': 'Test',
            'email': 'test@test.com',
            'phone': '1234567890',
            'startup_name': 'Test Startup',
            'scheme': 'nidhi_prayas',
            'description': 'Test desc',
            'pitch_deck': 'https://test.com/deck.pdf'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_funding_request_invalid(self):
        """Test creating funding request with invalid data."""
        url = '/api/support/funding/'
        data = {
            'name': 'Test'
            # Missing required fields
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_mentoring_request(self):
        """Test creating mentoring request."""
        mentor = Mentor.objects.create(
            name='Mentor', domain='Tech',
            image='https://test.com/img.png', bio='Bio'
        )
        url = '/api/support/mentoring/'
        data = {
            'name': 'Test',
            'email': 'test@test.com',
            'phone': '1234567890',
            'startup_name': 'Test Startup',
            'domain': 'Tech',
            'mentor': mentor.id,
            'description': 'Test desc'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_validation_request(self):
        """Test creating validation request."""
        url = '/api/support/validation/'
        data = {
            'name': 'Test',
            'email': 'test@test.com',
            'phone': '1234567890',
            'startup_name': 'Test Startup',
            'idea_details': 'Test idea',
            'testing_requirements': 'Test requirements',
            'target_market': 'B2B'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


print("""
=============================================================================
DJANGO TESTCASE SUMMARY
=============================================================================
Test Classes:
  - AuthenticationTests: 4 tests
  - HomeDataTests: 2 tests
  - PortfolioTests: 1 test
  - ContactTests: 1 test
  - UserManagementTests: 2 tests
  - MentorTests: 1 test
  - SupportServicesTests: 3 tests

Total Tests: 14
=============================================================================
""")

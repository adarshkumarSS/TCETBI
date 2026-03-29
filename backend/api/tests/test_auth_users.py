from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from api.models import AppUser

User = get_user_model()

class AuthUserTest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username="admin", email="admin@test.com", password="password")
        self.user = User.objects.create_user(username="user", email="user@test.com", password="password", status="approved")

    def test_admin_login(self):
        payload = {"email": "admin", "password": "password"}
        res = self.client.post(reverse('admin_login'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)

    def test_user_login(self):
        payload = {"username": "user", "password": "password"}
        res = self.client.post(reverse('user_login'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)

    def test_get_users_unauthorized(self):
        res = self.client.get(reverse('get_users'))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

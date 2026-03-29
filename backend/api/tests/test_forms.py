from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import FormTemplate
from django.contrib.auth import get_user_model

import unittest

class FormsTest(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.admin = User.objects.create_superuser(username="admin", email="admin@test.com", password="password")

    def test_list_form_templates(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse('list_form_templates'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @unittest.skip("TODO: Implement view")
    def test_create_form_template(self):
        self.client.force_authenticate(user=self.admin)
        payload = {
            "title": "Test Form",
            "form_type": "test_form",
            "description": "A form"
        }
        res = self.client.post(reverse('create_form_template'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FormTemplate.objects.count(), 1)

    def test_get_form_structure(self):
        FormTemplate.objects.create(name="T", form_type="test_form")
        res = self.client.get(reverse('get_form_structure', args=['test_form']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

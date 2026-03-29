import json
import unittest
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import TBIContactInfo, ContactMessage

class ContactTest(APITestCase):
    def test_get_tbi_contact_data(self):
        response = self.client.get(reverse('tbi_contact_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @unittest.skip("TODO: Update TBI contact endpoint sync")
    def test_update_tbi_contact_data(self):
        TBIContactInfo.objects.create(contact_email="old@test.com", map_embed_url="X")
        payload = {
            "contact_email": "tbi@test.com",
            "contact_phone": "1234567890",
            "contact_address": "123 Admin Lane",
            "social_links": [{"platform": "linkedin", "url": "http://linkedin.com"}]
        }
        res = self.client.put(reverse('update_tbi_contact_data'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(TBIContactInfo.objects.first().contact_email, "tbi@test.com")

    def test_submit_contact_message(self):
        payload = {
            "name": "User",
            "email": "user@test.com",
            "subject": "Inquiry",
            "message": "Hello!"
        }
        res = self.client.post(reverse('submit_contact_message'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

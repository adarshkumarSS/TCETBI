import unittest
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Mentor, FundingRequest

class SupportTest(APITestCase):
    def test_mentors_list(self):
        response = self.client.get('/api/mentors/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_funding_request(self):
        payload = {
            "startup_name": "New Seed",
            "name": "Founder X",
            "email": "x@test.com",
            "amount_requested": "50000",
            "scheme": "nidhi_prayas",
            "description": "R&D",
            "pitch_deck": "url"
        }
        res = self.client.post('/api/support/funding/', data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FundingRequest.objects.count(), 1)

    @unittest.skip("Requires strict multipart form with all Reference json strings populated")
    def test_submit_incubation(self):
        payload = {
            "businessName": "Incubee",
            "fullName": "Incubee Founder",
            "email": "incubee@test.com",
            "resMobile": "9999999999",
            "salutation": "Mr",
            "age": 25,
            "address": "123",
            "city": "C",
            "state": "S",
            "post": "P",
            "country": "IN",
            "businessType": "T",
            "legalEntity": "E",
            "businessDescription": "D"
        }
        res = self.client.post(reverse('submit_incubation'), data=payload, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

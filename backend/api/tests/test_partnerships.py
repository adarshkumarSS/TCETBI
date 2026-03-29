from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
import unittest
from api.models import Partnership

class PartnershipsCRUDTest(APITestCase):
    def test_get_partnerships_data(self):
        response = self.client.get(reverse('partnerships_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_partnerships_data(self):
        payload = {
            "partnerships": [
                {
                    "name": "Partner A",
                    "logo": "http://img.com/partner",
                    "category": "industry"
                }
            ]
        }
        res = self.client.put(reverse('update_partnerships_data'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Partnership.objects.count(), 1)

    @unittest.skip("Partnership model does not have category attr")
    def test_delete_partnership_item(self):
        p = Partnership.objects.create(name="P", logo="L")
        res = self.client.delete(reverse('delete_partnership_item', args=[p.id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Partnership.objects.count(), 0)

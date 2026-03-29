from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Facility, FacilityVideo

class FacilitiesCRUDTest(APITestCase):
    def test_get_facilities_data(self):
        response = self.client.get(reverse('facilities_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_facilities_data(self):
        payload = {
            "facilities": [{"image": "http://img.com/1", "description": "Lab"}],
            "videos": [{"video": "http://vid.com/1"}]
        }
        response = self.client.put(reverse('update_facilities_data'), data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Facility.objects.count(), 1)
        self.assertEqual(FacilityVideo.objects.count(), 1)

    def test_delete_facility_item(self):
        fac = Facility.objects.create(image="url", description="desc")
        response = self.client.delete(reverse('delete_facility_item', args=[fac.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Facility.objects.count(), 0)

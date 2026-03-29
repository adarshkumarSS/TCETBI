import json
import unittest
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import VisionMission, Achievement, Logo, SuccessStory

class HomeCRUDTest(APITestCase):
    def test_get_home_data(self):
        response = self.client.get(reverse('get_home_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_home_data_valid(self):
        payload = {
            "vision_mission": {"vision": "To be the best", "mission": "Testing mission"},
            "achievements": [{"number": 100, "suffix": "+", "label": "Startups"}],
            "govt_logos": [],
            "state_logos": [],
            "success_stories": [
                {
                    "title": "Story 1",
                    "description": "Desc 1",
                    "sector": "Tech",
                    "impact": "High",
                    "image": "http://dummyimage.com/1"
                }
            ]
        }
        response = self.client.put(reverse('update_home_data'), data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(VisionMission.objects.first().vision, "To be the best")
        self.assertEqual(Achievement.objects.count(), 1)
        self.assertEqual(SuccessStory.objects.count(), 1)

    def test_update_home_data_invalid_json(self):
        response = self.client.put(reverse('update_home_data'), data={"data": "{"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @unittest.skip("TODO: Mock delete_cloudinary_image")
    def test_delete_success_story(self):
        story = SuccessStory.objects.create(title="T", description="D", image="img")
        response = self.client.delete(reverse('delete_success_story', args=[story.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(SuccessStory.objects.count(), 0)

    def test_delete_success_story_not_found(self):
        response = self.client.delete(reverse('delete_success_story', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

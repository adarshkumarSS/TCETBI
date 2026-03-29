from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
import unittest
from api.models import MediaItem

class MediaCRUDTest(APITestCase):
    def test_get_media_data(self):
        response = self.client.get(reverse('media_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @unittest.skip("TODO: Image integrity error missing payload")
    def test_update_album(self):
        payload = {
            "type": "image",
            "items": [
                {"src": "http://img.com/media1"}
            ]
        }
        res = self.client.put(reverse('update_album', args=['TestAlbum']), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(MediaItem.objects.count(), 1)

    @unittest.skip("TODO: Mock delete_cloudinary_image")
    def test_delete_album(self):
        MediaItem.objects.create(album="TempAlbum", image="url", category="events")
        res = self.client.delete(reverse('delete_album', args=['TempAlbum']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(MediaItem.objects.count(), 0)

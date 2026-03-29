from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Blog

class BlogsCRUDTest(APITestCase):
    def test_get_blogs_data(self):
        response = self.client.get(reverse('blogs_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_blogs_data(self):
        payload = {
            "blogs": [
                {
                    "title": "New Tech",
                    "content": "Innovations",
                    "author": "Author A",
                    "date": "2026-06-01",
                    "cover_image": "http://img.com/blog"
                }
            ]
        }
        res = self.client.put(reverse('update_blogs_data'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Blog.objects.count(), 1)

    def test_delete_blog_item(self):
        blog = Blog.objects.create(title="T", excerpt="E", author="A", category="Tech", image="url", link="#")
        res = self.client.delete(reverse('delete_blog_item', args=[blog.id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Blog.objects.count(), 0)

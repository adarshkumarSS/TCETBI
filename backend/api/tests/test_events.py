from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Event

class EventsCRUDTest(APITestCase):
    def test_get_events_data(self):
        response = self.client.get(reverse('events_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_events_data(self):
        payload = {
            "events": [
                {
                    "title": "Summit 2026",
                    "description": "Annual tech summit",
                    "startDate": "2026-05-20",
                    "endDate": "2026-05-21",
                    "status": "upcoming",
                    "image": "http://img.com/evt",
                    "duration": "2 Days"
                }
            ]
        }
        res = self.client.put(reverse('update_events_data'), data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 1)

    def test_delete_event_item(self):
        evt = Event.objects.create(title="T", description="D", startDate="2026-01-01", endDate="2026-01-02", status="upcoming", image="img", duration="1 day")
        res = self.client.delete(reverse('delete_event_item', args=[evt.id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 0)

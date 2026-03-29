import json
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Startup

class StartupCRUDTest(APITestCase):
    def test_complete_crud_cycle(self):
        # 1. CREATE (Insert via Sync)
        payload = {
            "current_startups": [
                {
                    "name": "Test Startup",
                    "sector": "Technology",
                    "founded": "2024",
                    "website": "https://test.com",
                    "location": "Test City",
                    "category": "current",
                    "ceos": []
                }
            ],
            "graduated_startups": []
        }
        
        # Call PUT update_portfolio_data
        response = self.client.put(reverse('update_portfolio_data'), data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to create startup via sync")
        
        # Verify it was created in the DB
        self.assertEqual(Startup.objects.count(), 1)
        startup = Startup.objects.first()
        self.assertEqual(startup.name, "Test Startup")
        
        # 2. READ (Fetch via GET)
        response = self.client.get(reverse('get_portfolio_data'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(len(data['current_startups']), 1)
        self.assertEqual(data['current_startups'][0]['name'], "Test Startup")
        
        # 3. UPDATE (Modify and sync again)
        startup_id = data['current_startups'][0]['id']
        payload['current_startups'][0]['id'] = startup_id  # Include ID to update rather than create
        payload['current_startups'][0]['name'] = "Updated Startup"
        
        response = self.client.put(reverse('update_portfolio_data'), data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify it was updated in the DB
        startup.refresh_from_db()
        self.assertEqual(startup.name, "Updated Startup")
        
        # 4. DELETE
        response = self.client.delete(reverse('delete_startup', args=[startup_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify it was deleted
        self.assertEqual(Startup.objects.count(), 0)

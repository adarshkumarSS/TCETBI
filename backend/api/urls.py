from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisionMissionViewSet, AchievementViewSet, LogoViewSet, SuccessStoryViewSet
from .wrappers.home_view import get_home_data, update_home_data

router = DefaultRouter()
router.register(r'vision-mission', VisionMissionViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'logos', LogoViewSet)
router.register(r'stories', SuccessStoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('home-data/', get_home_data, name='get_home_data'),
    path('update-home-data/', update_home_data, name='update_home_data'),
]
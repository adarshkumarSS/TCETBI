from rest_framework import viewsets
from .models import VisionMission, Achievement, Logo, SuccessStory
from .serializers import VisionMissionSerializer, AchievementSerializer, LogoSerializer, SuccessStorySerializer

class VisionMissionViewSet(viewsets.ModelViewSet):
    queryset = VisionMission.objects.all()
    serializer_class = VisionMissionSerializer

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

class LogoViewSet(viewsets.ModelViewSet):
    queryset = Logo.objects.all()
    serializer_class = LogoSerializer

class SuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer

from rest_framework import serializers
from .models import LandingPageContent

class LandingPageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageContent
        fields = '__all__'

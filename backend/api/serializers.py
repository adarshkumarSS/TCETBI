from rest_framework import serializers
from .models import VisionMission, Achievement, Logo, SuccessStory, Startup, CEO, TBICEO, Founder, BoardMember, Facility , FacilityVideo, Program

class VisionMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionMission
        fields = '__all__'

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class LogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logo
        fields = '__all__'

class SuccessStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessStory
        fields = '__all__'

class CEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = CEO
        fields = ['id', 'name', 'bio', 'image']

class StartupSerializer(serializers.ModelSerializer):
    ceos = CEOSerializer(many=True, required=False)

    class Meta:
        model = Startup
        fields = ['id', 'name', 'logo', 'description', 'sector', 'founded', 'website', 'location', 'linkedin', 'twitter', 'facebook', 'products', 'category', 'ceos']

    def update(self, instance, validated_data):
        ceos_data = validated_data.pop('ceos', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update CEOs
        for ceo_data in ceos_data:
            CEO.objects.update_or_create(
                startup=instance,
                name=ceo_data.get('name'),
                defaults=ceo_data
            )
        return instance

class FounderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Founder
        fields = '__all__'

class TBICEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = TBICEO
        fields = '__all__'

class BoardMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardMember
        fields = '__all__'

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = "__all__"

class FacilityVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityVideo
        fields = "__all__"

class ProgramSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(format="%Y-%m-%d")
    endDate = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Program
        fields = "__all__"


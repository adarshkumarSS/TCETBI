from rest_framework import serializers
from .models import VisionMission, Achievement, Logo, SuccessStory, Startup, CEO, TBICEO, Founder, BoardMember, Facility , FacilityVideo, Program, MediaItem, Blog, TBIContactInfo, ContactMessage, Notification

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

class MediaItemSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = MediaItem
        fields = "__all__"

    def get_title(self, obj):
        """
        If title is empty/null → use album name formatted nicely.
        Example: "innovation-lab" → "Innovation Lab"
        """
        if obj.title and obj.title.strip():
            return obj.title

        # Fallback: album name prettified
        return " ".join(word.capitalize() for word in obj.album.split("-"))

    def get_description(self, obj):
        """
        If description empty/null → use a readable default based on album name.
        Example: "Photos from Innovation Lab album."
        """
        if obj.description and obj.description.strip():
            return obj.description

        # Fallback: pretty album description
        album_name = " ".join(word.capitalize() for word in obj.album.split("-"))
        return f"Photos from the {album_name} album."

class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = "__all__"

class TBIContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TBIContactInfo
        fields = "__all__"

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


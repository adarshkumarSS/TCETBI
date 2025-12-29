from rest_framework import serializers
from .models import VisionMission, Achievement, Logo, SuccessStory, Startup, CEO, TBICEO, Founder, BoardMember, Facility , FacilityVideo, Event, MediaItem, Blog, TBIContactInfo, ContactMessage, Notification, IncubationApplication, AppUser, UserCompanyRequest, Partnership, FormTemplate, FormField, FormSubmission, FormFieldValue
import os
from django.contrib.auth.models import User as DjangoUser

class PartnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partnership
        fields = '__all__'

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

class EventSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(format="%Y-%m-%d")
    endDate = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Event
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

class IncubationSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncubationApplication
        fields = "__all__"

class UserCompanyRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompanyRequest
        fields = "__all__"
        read_only_fields = ['user', 'admin_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the user from the request context when creating
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'status', 'date_joined', 'last_login', 'is_staff', 'is_superuser', 'must_change_password', 'profile_image']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AppUser
        fields = ['username', 'email', 'full_name', 'phone', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")

        # Check email uniqueness
        if AppUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email id already exists")

        # Check email not admin or CEO
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@tcetbi.edu')
        ceo = TBICEO.objects.first()
        ceo_email = ceo.email if ceo else None

        if data['email'].lower() == admin_email.lower():
            raise serializers.ValidationError("You cannot register with admin email")

        if ceo_email and data['email'].lower() == ceo_email.lower():
            raise serializers.ValidationError("You cannot register with CEO email")

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = AppUser.objects.create_user(**validated_data)
        return user

from .models import Mentor, FundingRequest, MentoringRequest, ValidationRequest

class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = '__all__'

class FundingRequestSerializer(serializers.ModelSerializer):
    user_details = AppUserSerializer(source='user', read_only=True)
    
    class Meta:
        model = FundingRequest
        fields = '__all__'
        read_only_fields = ['user', 'admin_notes', 'created_at', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

class MentoringRequestSerializer(serializers.ModelSerializer):
    user_details = AppUserSerializer(source='user', read_only=True)
    mentor_details = MentorSerializer(source='mentor', read_only=True)

    class Meta:
        model = MentoringRequest
        fields = '__all__'
        read_only_fields = ['user', 'admin_notes', 'created_at', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

class ValidationRequestSerializer(serializers.ModelSerializer):
    user_details = AppUserSerializer(source='user', read_only=True)

    class Meta:
        model = ValidationRequest
        fields = '__all__'
        read_only_fields = ['user', 'admin_notes', 'created_at', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

# Form Builder Serializers

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = '__all__'
        read_only_fields = ['form_template']

class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)
    
    class Meta:
        model = FormTemplate
        fields = '__all__'

class FormFieldValueSerializer(serializers.ModelSerializer):
    field_label = serializers.CharField(source='field.label', read_only=True)
    field_type = serializers.CharField(source='field.field_type', read_only=True)
    
    class Meta:
        model = FormFieldValue
        fields = '__all__'
        read_only_fields = ['submission']

class FormSubmissionSerializer(serializers.ModelSerializer):
    field_values = FormFieldValueSerializer(many=True, read_only=True)
    form_name = serializers.CharField(source='form_template.name', read_only=True)
    form_type = serializers.CharField(source='form_template.form_type', read_only=True)
    user_details = AppUserSerializer(source='user', read_only=True)
    
    class Meta:
        model = FormSubmission
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

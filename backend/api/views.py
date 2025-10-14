from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from django.utils import timezone
from .models import User, OTP
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    OTPVerificationSerializer,
    UserSerializer
)
from .email_service import send_admin_notification, send_otp_email
from django.http import JsonResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin(request):
    """
    Check if the current user is an admin
    """
    is_admin = request.user.role == 'admin'
    return Response({
        'is_admin': is_admin,
        'user': UserSerializer(request.user).data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Create OTP
        otp = OTP.objects.create(user=user)
        
        # Send OTP email from admin
        if send_otp_email(user.email, otp.otp_code):
            # Optional: Send notification to admins
            send_admin_notification(user.email)
            
            return Response({
                'message': 'Registration successful. OTP sent to your email for verification.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Registration successful but failed to send OTP email.'
            }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    serializer = OTPVerificationSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        
        try:
            user = User.objects.get(email=email, role='pending')
            otp = OTP.objects.filter(user=user, otp_code=otp_code).last()
            
            if otp and otp.is_valid():
                # Mark OTP as used
                otp.is_used = True
                otp.save()
                
                # Activate user
                user.role = 'member'
                user.is_verified = True
                user.is_active = True
                user.save()
                
                return Response({
                    'message': 'Account verified successfully. You can now login.'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid or expired OTP'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_otp(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email, role='pending')
        
        # Invalidate previous OTPs
        OTP.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create new OTP
        otp = OTP.objects.create(user=user)
        
        if send_otp_email(user.email, otp.otp_code):
            return Response({
                'message': 'New OTP sent to your email.'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Failed to send OTP email'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except User.DoesNotExist:
        return Response({
            'error': 'User not found or already verified'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    return Response(UserSerializer(request.user).data)


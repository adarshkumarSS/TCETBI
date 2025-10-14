from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('login/', views.login_user, name='login'),
    path('resend-otp/', views.resend_otp, name='resend-otp'),
    path('profile/', views.get_profile, name='profile'),
    path('check-admin/', views.check_admin, name='check-admin'),
]


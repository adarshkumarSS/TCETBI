from django.urls import path
from . import views

urlpatterns = [
    path('content/', views.get_all_content, name='get_all_content'),
    path('content/add/', views.create_content, name='create_content'),
]

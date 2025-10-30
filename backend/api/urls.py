from django.urls import path
from . import views

urlpatterns = [
    path('home-content/', views.get_all_content, name='get_all_content'),
    path('home-content/add/', views.create_content, name='create_content'),
    path("home-content/update/", views.update_content, name="update_content"),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .wrappers.home_view import get_home_data, update_home_data
from .wrappers.portfolio_view import get_portfolio_data,update_portfolio_data,delete_startup

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('home-data/', get_home_data, name='get_home_data'),
    path('update-home-data/', update_home_data, name='update_home_data'),
    
    path('portfolio-data/', get_portfolio_data, name='get_portfolio_data'),
    path("update-portfolio-data/", update_portfolio_data, name="update_portfolio_data"),
    path("delete-startup/<int:id>/", delete_startup, name="delete_startup"),




    
]

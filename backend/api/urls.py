from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .wrappers.home_view import get_home_data, update_home_data, delete_success_story
from .wrappers.portfolio_view import get_portfolio_data,update_portfolio_data,delete_startup
from .wrappers.people_view import get_people_data, update_people_data, delete_board_member

router = DefaultRouter()
 
urlpatterns = [
    path('', include(router.urls)),

    path('home-data/', get_home_data, name='get_home_data'),
    path('update-home-data/', update_home_data, name='update_home_data'),
    path("delete-success-story/<int:id>/", delete_success_story, name="delete_success_story"), 
    
    path('portfolio-data/', get_portfolio_data, name='get_portfolio_data'),
    path('update-portfolio-data/', update_portfolio_data, name='update_portfolio_data'),
    path('delete-startup/<int:id>/', delete_startup, name='delete_startup'),

    path('people-data/', get_people_data, name='get_people_data'),
    path("update-people-data/", update_people_data, name="update_people_data"),
    path("delete-board-member/<int:id>/", delete_board_member, name="delete_board_member"),

]


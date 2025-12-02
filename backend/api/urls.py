from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .wrappers.home_view import get_home_data, update_home_data, delete_success_story
from .wrappers.portfolio_view import get_portfolio_data,update_portfolio_data,delete_startup
from .wrappers.people_view import get_people_data, update_people_data, delete_board_member
from .wrappers.facility_view import get_facilities_data, update_facilities_data, delete_facility_item
from .wrappers.program_view import get_programs_data, update_programs_data, delete_program_item
from .wrappers.media_view import get_media_data, update_album, delete_album
from .wrappers.blog_view import get_blogs_data, update_blogs_data, delete_blog_item
from .wrappers.tbi_contact_view import get_tbi_contact_data, update_tbi_contact_data
from .views import (
    submit_contact_message, get_notifications, mark_notification_read, delete_notification,
    submit_incubation, get_incubation_applications, update_application_status,
    admin_login, refresh_token, admin_logout, user_logout, admin_profile, change_admin_password,
    user_register, user_login, get_users, update_user_status, delete_user, get_pending_users, create_user,
    get_user_profile, update_user_profile, get_user_company_request, create_or_update_company_request,
    submit_company_request, submit_company_edit_request, delete_company_request, get_company_requests_admin, review_company_request
)

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
    
    path("facilities-data/", get_facilities_data, name="facilities_data"),
    path("update-facilities-data/", update_facilities_data, name="update_facilities_data"),
    path("delete-facility-item/<int:id>/", delete_facility_item, name="delete_facility_item"),

    path("programs-data/", get_programs_data, name="programs_data"),
    path("update-programs-data/", update_programs_data, name="update_programs_data"),
    path("delete-program-item/<int:id>/", delete_program_item, name="delete_program_item"),
    
    path("media-data/", get_media_data, name="media_data"),
    path("update-album/<str:album_name>/", update_album, name="update_album"),
    path("delete-album/<str:album_name>/", delete_album, name="delete_album"),
    
    path("blogs-data/", get_blogs_data, name="blogs_data"),
    path("update-blogs-data/", update_blogs_data, name="update_blogs_data"),
    path("delete-blog-item/<int:id>/", delete_blog_item, name="delete_blog_item"),

    path("tbi-contact-data/", get_tbi_contact_data, name="tbi_contact_data"),
    path("update-tbi-contact-data/", update_tbi_contact_data, name="update_tbi_contact_data"),
    
    path("contact-message/", submit_contact_message, name="submit_contact_message"),
    
    path("notifications/", get_notifications, name="get_notifications"),
    path("notifications/read/<int:id>/", mark_notification_read, name="mark_notification_read"),
    path("notifications/delete/<int:id>/", delete_notification, name="delete_notification"),

    path("apply-incubation/", submit_incubation, name="submit_incubation"),
    path("incubation-applications/", get_incubation_applications, name="get_incubation_applications"),
    path("incubation-applications/<int:id>/status/", update_application_status, name="update_application_status"),

    # Auth endpoints
    path('auth/admin-login/', admin_login, name='admin_login'),
    path('auth/refresh/', refresh_token, name='refresh_token'),
    path('auth/admin-logout/', admin_logout, name='admin_logout'),
    path('auth/admin-profile/', admin_profile, name='admin_profile'),
    path('auth/change-password/', change_admin_password, name='change_password'),

    # User endpoints
    path('auth/user-register/', user_register, name='user_register'),
    path('auth/user-login/', user_login, name='user_login'),
    path('auth/user-logout/', user_logout, name='user_logout'),
    path('users/', get_users, name='get_users'),
    path('users/<int:user_id>/status/', update_user_status, name='update_user_status'),
    path('users/<int:user_id>/', delete_user, name='delete_user'),
    path('users/pending/', get_pending_users, name='get_pending_users'),
    path('users/create/', create_user, name='create_user'),
    path('user/profile/', get_user_profile, name='get_user_profile'),
    path('user/profile/update/', update_user_profile, name='update_user_profile'),
    path('user/company-request/', get_user_company_request, name='get_user_company_request'),
    path('user/company-request/update/', create_or_update_company_request, name='create_or_update_company_request'),
    path('user/company-request/submit/', submit_company_request, name='submit_company_request'),
    path('user/company-request/submit-edit/', submit_company_edit_request, name='submit_company_edit_request'),
    path('user/company-request/delete/', delete_company_request, name='delete_company_request'),
    path('admin/company-requests/', get_company_requests_admin, name='get_company_requests_admin'),
    path('admin/company-requests/<int:request_id>/review/', review_company_request, name='review_company_request'),

]

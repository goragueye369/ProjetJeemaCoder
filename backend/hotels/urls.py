from django.urls import path
from . import views

app_name = 'hotels'

urlpatterns = [
    # API Root
    path('', views.api_root, name='api-root'),
    
    # Hotels endpoints
    path('hotels/', views.hotel_list, name='hotel-list'),
    path('hotels/<str:pk>/', views.hotel_detail, name='hotel-detail'),
    
    # Rooms endpoints
    path('rooms/', views.room_list, name='room-list'),
    path('rooms/<str:pk>/', views.room_detail, name='room-detail'),
    
    # Bookings endpoints
    path('bookings/', views.booking_list, name='booking-list'),
    path('bookings/<str:pk>/', views.booking_detail, name='booking-detail'),
    
    # Users endpoints
    path('users/', views.user_list, name='user-list'),
    path('users/<str:pk>/', views.user_detail, name='user-detail'),
    
    # URLs d'authentification
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # URL pour servir les images
    path('media/<path:image_path>', views.serve_image_v2, name='serve-image'),
]

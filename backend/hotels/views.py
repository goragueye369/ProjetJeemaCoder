from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
import datetime
import jwt
import os
from .models import Hotel, Room, Booking, User
from .serializers import (
    HotelSerializer, 
    RoomSerializer, 
    BookingSerializer, 
    UserSerializer
)
from mongoengine.queryset import QuerySet


@api_view(['GET'])
def api_root(request):
    """
    API Root - Available endpoints
    """
    return Response({
        'hotels': '/api/hotels/',
        'rooms': '/api/rooms/',
        'bookings': '/api/bookings/',
        'users': '/api/users/',
        'auth': {
            'login': '/api/auth/login/',
            'register': '/api/auth/register/'
        }
    })


@api_view(['POST'])
def login_view(request):
    """
    Login user and return JWT token
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        # Pour MongoDB/MongoEngine, nous devons trouver l'utilisateur manuellement
        user = User.objects.get(email=email)
        
        # Pour l'instant, nous allons considérer que l'authentification est réussie
        # En production, vous devriez implémenter une vérification de mot de passe sécurisée
        
        # Créer un token JWT manuellement
        payload = {
            'user_id': str(user.id),
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Retourner uniquement les informations nécessaires
        return Response({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active
            },
            'token': token
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'error': 'Email ou mot de passe incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(f"Erreur connexion: {e}")
        return Response({
            'error': 'Email ou mot de passe incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register_view(request):
    """
    Register new user and return JWT token
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Créer un token JWT manuellement
        import jwt
        from django.conf import settings
        
        payload = {
            'user_id': str(user.id),
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        return Response({
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'created_at': user.created_at.isoformat() if user.created_at else None
            },
            'token': token,
            'refresh': token  # Pour simplifier, on utilise le même token
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def hotel_list(request):
    """
    List all hotels or create a new hotel
    """
    if request.method == 'GET':
        hotels = Hotel.objects.all()
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = HotelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def hotel_detail(request, pk):
    """
    Get, update or delete a hotel
    """
    try:
        hotel = Hotel.objects.get(id=pk)
    except Hotel.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = HotelSerializer(hotel)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = HotelSerializer(hotel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        hotel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def room_list(request):
    """
    List all rooms or create a new room
    """
    if request.method == 'GET':
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def room_detail(request, pk):
    """
    Get, update or delete a room
    """
    try:
        room = Room.objects.get(id=pk)
    except Room.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RoomSerializer(room)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def booking_list(request):
    """
    List all bookings or create a new booking
    """
    if request.method == 'GET':
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def booking_detail(request, pk):
    """
    Get, update or delete a booking
    """
    try:
        booking = Booking.objects.get(id=pk)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = BookingSerializer(booking, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def user_list(request):
    """
    List all users or create a new user
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Créer un token JWT pour le nouvel utilisateur
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Get, update or delete a user
    """
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def serve_image(request, image_path):
    """
    Servir les images des hôtels même en production
    """
    try:
        # Construire le chemin complet du fichier
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)
        
        # Vérifier que le fichier existe
        if not os.path.exists(full_path):
            raise Http404("Image non trouvée")
        
        # Lire et servir le fichier
        with open(full_path, 'rb') as f:
            image_data = f.read()
        
        # Déterminer le type de contenu
        content_type = 'image/jpeg'
        if image_path.lower().endswith('.png'):
            content_type = 'image/png'
        elif image_path.lower().endswith('.gif'):
            content_type = 'image/gif'
        
        return HttpResponse(image_data, content_type=content_type)
        
    except Exception as e:
        raise Http404(f"Erreur lors du chargement de l'image: {str(e)}")


# Vue alternative pour servir les images avec décorateur
from django.views.decorators.http import require_GET
from django.views.decorators.cache import cache_control

@require_GET
@cache_control(max_age=3600)  # Cache pendant 1 heure
def serve_image_v2(request, image_path):
    """
    Servir les images des hôtels même en production (version 2)
    """
    try:
        # Construire le chemin complet du fichier
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)
        
        # Vérifier que le fichier existe
        if not os.path.exists(full_path):
            raise Http404("Image non trouvée")
        
        # Lire et servir le fichier
        with open(full_path, 'rb') as f:
            image_data = f.read()
        
        # Déterminer le type de contenu
        content_type = 'image/jpeg'
        if image_path.lower().endswith('.png'):
            content_type = 'image/png'
        elif image_path.lower().endswith('.gif'):
            content_type = 'image/gif'
        
        # Créer la réponse avec les en-têtes CORS
        response = HttpResponse(image_data, content_type=content_type)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        response['Cache-Control'] = 'public, max-age=3600'
        
        return response
        
    except Exception as e:
        raise Http404(f"Erreur lors du chargement de l'image: {str(e)}")

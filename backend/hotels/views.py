from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
import datetime
import jwt
import os
from .models import Hotel, Room, Booking
from .serializers import (
    HotelSerializer, 
    RoomSerializer, 
    BookingSerializer, 
    UserSerializer
)

User = get_user_model()


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
            'register': '/api/auth/register/',
            'logout': '/api/auth/logout/'
        }
    })


@api_view(['POST'])
def login_view(request):
    """
    Login user and return JWT token
    """
    print(f"DEBUG: Requête reçue: {request.method}")
    print(f"DEBUG: Données reçues: {request.data}")
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email et mot de passe sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Récupérer l'utilisateur par email
        user = User.objects.get(email=email)
        print(f"DEBUG: Utilisateur trouvé: {user.email}")
        
        # Authentifier avec le username de l'utilisateur
        authenticated_user = authenticate(username=user.username, password=password)
        print(f"DEBUG: Utilisateur authentifié: {authenticated_user is not None}")
        
        if authenticated_user is not None:
            # Créer un token JWT manuellement
            payload = {
                'user_id': str(user.id),
                'email': user.email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow()
            }
            
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            print(f"DEBUG: Token généré: {token[:20]}...")
            
            response_data = {
                'success': True,
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_active': user.is_active
                },
                'token': token
            }
            
            print(f"DEBUG: Réponse envoyée au frontend: {response_data}")
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            print(f"DEBUG: Échec d'authentification pour {email}")
            return Response({
                'error': 'Email ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        print(f"DEBUG: Utilisateur non trouvé: {email}")
        return Response({
            'error': 'Email ou mot de passe incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(f"DEBUG: Erreur inattendue: {e}")
        return Response({
            'error': 'Erreur lors de la connexion'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def register_view(request):
    """
    Register new user and return JWT token
    """
    print(f"DEBUG: Requête inscription reçue: {request.method}")
    print(f"DEBUG: Données reçues: {request.data}")
    
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        print(f"DEBUG: Utilisateur créé: {user.email}")
        
        # Créer un token JWT manuellement
        payload = {
            'user_id': str(user.id),
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        print(f"DEBUG: Token généré: {token[:20]}...")
        
        return Response({
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'date_joined': user.date_joined.isoformat() if user.date_joined else None
            },
            'token': token,
            'refresh': token  # Pour simplifier, on utilise le même token
        }, status=status.HTTP_201_CREATED)
    
    else:
        print(f"DEBUG: Erreurs serializer: {serializer.errors}")
        # Formatter le message d'erreur pour le frontend
        error_messages = []
        for field, errors in serializer.errors.items():
            for error in errors:
                error_messages.append(f"{field}: {error}")
        
        error_message = " | ".join(error_messages)
        print(f"DEBUG: Message d'erreur formaté: {error_message}")
        
        # Messages d'erreur spécifiques et conviviaux
        if 'email' in serializer.errors:
            return Response({
                'success': False,
                'error': 'Cet email est déjà utilisé. Veuillez en choisir un autre.',
                'type': 'email_exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        elif 'password' in serializer.errors or 'password_confirmation' in serializer.errors:
            return Response({
                'success': False,
                'error': 'Les mots de passe ne correspondent pas ou sont invalides.',
                'type': 'password_mismatch'
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'success': False,
                'error': error_message or 'Erreur lors de l\'inscription',
                'type': 'general_error'
            }, status=status.HTTP_400_BAD_REQUEST)


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
    Get, update or delete a specific hotel
    """
    try:
        hotel = Hotel.objects.get(pk=pk)
    except Hotel.DoesNotExist:
        return Response({'error': 'Hotel not found'}, status=status.HTTP_404_NOT_FOUND)
    
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
    Get, update or delete a specific room
    """
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
    
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
    Get, update or delete a specific booking
    """
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    
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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Get, update or delete a specific user
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
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


def serve_image_v2(request, image_path):
    """
    Servir les images uploadées
    """
    import os
    from django.http import HttpResponse
    from django.conf import settings
    
    image_full_path = os.path.join(settings.MEDIA_ROOT, image_path)
    
    if os.path.exists(image_full_path):
        with open(image_full_path, 'rb') as f:
            image_data = f.read()
            return HttpResponse(image_data, content_type='image/jpeg')
    

@api_view(['POST'])
def logout_view(request):
    """
    Logout user - simple response for frontend
    """
    return Response({
        'success': True,
        'message': 'Déconnexion réussie'
    }, status=status.HTTP_200_OK)

from rest_framework import serializers
from .models import Hotel, Room, Booking
from django.contrib.auth.models import User
from django.conf import settings
import os
import uuid


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True, min_length=8)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        # Vérifier la correspondance des mots de passe
        password = validated_data.get('password')
        password_confirmation = validated_data.get('password_confirmation')
        
        if password != password_confirmation:
            raise serializers.ValidationError('Les mots de passe ne correspondent pas')
        
        # Vérifier si l'email existe déjà
        email = validated_data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(f'Cet email {email} est déjà utilisé')
        
        # Générer un username unique à partir de l'email si non fourni
        if not validated_data.get('username'):
            base_username = validated_data['email'].split('@')[0]
            username = base_username
            counter = 1
            # Vérifier l'unicité du username
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            validated_data['username'] = username
        
        # Hasher le mot de passe
        from django.contrib.auth.hashers import make_password
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        
        # Créer l'utilisateur avec les champs validés
        try:
            # Créer l'objet User directement avec tous les champs
            user_data = {
                'username': validated_data['username'],
                'email': validated_data['email'],
                'password': validated_data['password'],
                'first_name': validated_data.get('first_name', ''),
                'last_name': validated_data.get('last_name', ''),
                'is_active': True
            }
            user = User.objects.create(**user_data)
            print(f"DEBUG: Utilisateur créé: {user.email}")
            return user
        except Exception as e:
            print(f"Erreur création utilisateur: {e}")
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RoomSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    hotel = serializers.CharField()
    room_number = serializers.CharField(max_length=10)
    room_type = serializers.CharField(max_length=50)
    capacity = serializers.CharField()
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Room.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class HotelSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(max_length=500)
    city = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default='Sénégal')
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    website = serializers.CharField(max_length=200, required=False, allow_blank=True)
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3, default='XOF')
    rating = serializers.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    is_active = serializers.BooleanField(default=True)
    image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    image_url = serializers.SerializerMethodField()
    slug = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    # Relations
    rooms = RoomSerializer(many=True, read_only=True)

    def get_image_url(self, obj):
        """Retourner l'URL complète de l'image ou null"""
        if obj.image:
            # Si c'est un objet ImageFieldFile
            if hasattr(obj.image, 'url'):
                image_url = obj.image.url
                # Convertir en URL absolue si nécessaire
                if image_url.startswith('/'):
                    base_url = getattr(settings, 'BASE_URL', 'http://127.0.0.1:8000')
                    return f"{base_url}{image_url}"
                return image_url
            # Si l'image est une chaîne de caractères (chemin du fichier)
            elif isinstance(obj.image, str):
                base_url = getattr(settings, 'BASE_URL', 'http://127.0.0.1:8000')
                return f"{base_url}/media/{obj.image}"
        return None

    def create(self, validated_data):
        # Vérifier si le nom de l'hôtel existe déjà
        name = validated_data.get('name')
        if Hotel.objects.filter(name=name).exists():
            raise serializers.ValidationError(f'Un hôtel avec le nom "{name}" existe déjà')
        
        # Gérer l'upload d'image si présent
        image_file = validated_data.pop('image', None)
        
        # Créer l'hôtel avec les données validées
        hotel = Hotel(**validated_data)
        
        # Sauvegarder d'abord pour générer le slug
        hotel.save()
        
        # Gérer l'upload d'image si elle existe
        if image_file:
            # Générer un nom de fichier unique
            filename = f"hotel_{hotel.id}_{uuid.uuid4().hex[:8]}.jpg"
            
            # Créer le répertoire media s'il n'existe pas
            media_path = os.path.join(settings.MEDIA_ROOT, 'hotel_images')
            os.makedirs(media_path, exist_ok=True)
            
            # Sauvegarder le fichier
            file_path = os.path.join(media_path, filename)
            with open(file_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            
            # Stocker le nom du fichier dans la base de données
            hotel.image = f"hotel_images/{filename}"
            hotel.save()
        
        return hotel

    def update(self, instance, validated_data):
        # Gérer l'upload d'image si présent
        image_file = validated_data.pop('image', None)
        
        # Mettre à jour les champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Gérer l'upload d'image si elle existe
        if image_file:
            # Générer un nom de fichier unique
            filename = f"hotel_{instance.id}_{uuid.uuid4().hex[:8]}.jpg"
            
            # Créer le répertoire media s'il n'existe pas
            media_path = os.path.join(settings.MEDIA_ROOT, 'hotel_images')
            os.makedirs(media_path, exist_ok=True)
            
            # Sauvegarder le fichier
            file_path = os.path.join(media_path, filename)
            with open(file_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            
            # Stocker le nom du fichier dans la base de données
            instance.image = f"hotel_images/{filename}"
        
        instance.save()
        return instance


class BookingSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    hotel = serializers.CharField()
    user = serializers.CharField()
    room = serializers.CharField()
    check_in = serializers.DateTimeField()
    check_out = serializers.DateTimeField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.CharField(max_length=20, default='pending')
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Booking.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

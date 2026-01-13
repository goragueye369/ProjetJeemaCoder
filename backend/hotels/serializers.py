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

    def validate(self, data):
        # Vérifier la correspondance des mots de passe
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        
        if password != password_confirmation:
            raise serializers.ValidationError({
                'password_confirmation': 'Les mots de passe ne correspondent pas'
            })
        
        # Vérifier si l'email existe déjà
        email = data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                'email': 'Cet email est déjà utilisé'
            })
        
        return data

    def create(self, validated_data):
        # Supprimer password_confirmation des données validées
        validated_data.pop('password_confirmation', None)
        
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


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'hotel', 'room_number', 'room_type', 'capacity', 'price_per_night', 'is_available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'description', 'address', 'city', 'country', 'email', 'phone', 'website', 
                 'price_per_night', 'currency', 'rating', 'is_active', 'image', 'image_url', 'slug', 
                 'created_at', 'updated_at', 'rooms']
        read_only_fields = ['id', 'image_url', 'slug', 'created_at', 'updated_at', 'rooms']

    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        """Retourner l'URL complète de l'image ou null"""
        if obj.image:
            base_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000')
            return f"{base_url}/media/{obj.image}"
        return None


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'hotel', 'user', 'room', 'check_in', 'check_out', 'total_price', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

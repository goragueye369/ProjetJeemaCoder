#!/usr/bin/env python
"""
Script pour ajouter des données exemples dans MongoDB (sans index)
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from mongoengine import connect, get_connection
from datetime import datetime, timedelta

def add_sample_data():
    """Ajouter des données exemples directement dans MongoDB"""
    
    print("📝 Ajout de données exemples dans MongoDB...")
    
    try:
        connection = get_connection()
        db = connection.hotels_db
        
        # Créer un utilisateur
        user_data = {
            "username": "admin",
            "email": "admin@hotels.com",
            "first_name": "Admin",
            "last_name": "System",
            "is_active": True,
            "created_at": datetime.now()
        }
        result = db.users.insert_one(user_data)
        user_id = result.inserted_id
        print(f"✅ Utilisateur créé: {user_id}")
        
        # Créer des hôtels
        hotels_data = [
            {
                "name": "Hôtel Royal Dakar",
                "description": "Hôtel de luxe face à l'océan",
                "address": "Boulevard de la Liberation",
                "city": "Dakar",
                "country": "Sénégal",
                "email": "info@royaldakar.sn",
                "phone": "+221 33 123 45 67",
                "website": "https://www.royaldakar.sn",
                "price_per_night": 150000,
                "currency": "XOF",
                "rating": 4.5,
                "is_active": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "slug": "hotel-royal-dakar"
            },
            {
                "name": "Résidence Saly",
                "description": "Hôtel de charme à Saly",
                "address": "Route de Saly",
                "city": "Saly",
                "country": "Sénégal",
                "email": "contact@residencesaly.sn",
                "phone": "+221 33 987 65 43",
                "price_per_night": 75000,
                "currency": "XOF",
                "rating": 4.0,
                "is_active": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "slug": "residence-saly"
            }
        ]
        
        hotel_ids = []
        for hotel_data in hotels_data:
            result = db.hotels.insert_one(hotel_data)
            hotel_ids.append(result.inserted_id)
            print(f"✅ Hôtel créé: {hotel_data['name']}")
        
        # Créer des chambres
        rooms_data = [
            {
                "hotel": hotel_ids[0],
                "room_number": "101",
                "room_type": "Suite Deluxe",
                "capacity": "2",
                "price_per_night": 180000,
                "is_available": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "hotel": hotel_ids[0],
                "room_number": "102",
                "room_type": "Chambre Standard",
                "capacity": "2",
                "price_per_night": 120000,
                "is_available": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "hotel": hotel_ids[1],
                "room_number": "201",
                "room_type": "Chambre Double",
                "capacity": "2",
                "price_per_night": 85000,
                "is_available": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
        ]
        
        room_ids = []
        for room_data in rooms_data:
            result = db.rooms.insert_one(room_data)
            room_ids.append(result.inserted_id)
            print(f"✅ Chambre créée: {room_data['room_number']}")
        
        # Créer une réservation
        booking_data = {
            "hotel": hotel_ids[0],
            "user": user_id,
            "room": room_ids[0],
            "check_in": datetime.now() + timedelta(days=7),
            "check_out": datetime.now() + timedelta(days=10),
            "total_price": 540000,
            "status": "confirmed",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        result = db.bookings.insert_one(booking_data)
        print(f"✅ Réservation créée")
        
        print("\n🎉 Données exemples ajoutées avec succès!")
        print("📊 Vous pouvez maintenant voir les collections dans MongoDB Compass:")
        print("   - hotels (2 documents)")
        print("   - rooms (3 documents)")
        print("   - bookings (1 document)")
        print("   - users (1 document)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    add_sample_data()

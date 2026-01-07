#!/usr/bin/env python
"""
Script pour vérifier la connexion MongoDB et lister les bases
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from mongoengine import get_connection

def check_mongodb():
    """Vérifier MongoDB et lister les bases"""
    
    try:
        connection = get_connection()
        print("✅ Connexion à MongoDB établie")
        
        # Lister toutes les bases de données
        databases = connection.list_database_names()
        print(f"\n📊 Bases de données disponibles : {databases}")
        
        # Vérifier si hotels_db existe
        if 'hotels_db' in databases:
            print("✅ Base 'hotels_db' trouvée !")
            
            # Lister les collections dans hotels_db
            db = connection.hotels_db
            collections = db.list_collection_names()
            print(f"📁 Collections dans 'hotels_db' : {collections}")
            
            # Compter les documents dans chaque collection
            for collection_name in collections:
                collection = db[collection_name]
                count = collection.count_documents({})
                print(f"   - {collection_name} : {count} documents")
                
                # Afficher un exemple de document
                if count > 0:
                    sample = collection.find_one()
                    print(f"     Exemple : {list(sample.keys())[:5]}...")
                    
        else:
            print("❌ Base 'hotels_db' non trouvée")
            print("Création de la base...")
            
            # Créer la base en insérant un document
            db = connection.hotels_db
            result = db.test.insert_one({"test": "creation"})
            print(f"✅ Base 'hotels_db' créée avec ID : {result.inserted_id}")
            db.test.delete_one({"test": "creation"})  # Nettoyer
            print("🧹 Document de test supprimé")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur : {e}")
        return False

if __name__ == "__main__":
    check_mongodb()

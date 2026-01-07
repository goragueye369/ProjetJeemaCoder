#!/usr/bin/env python
"""
Script pour créer une base de données UTF-8 avec Django
"""
import os
import sys
import django

# Ajouter le répertoire backend au PYTHONPATH
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Importer psycopg2 avant le patch
import psycopg2

# Désactiver temporairement le patch
def create_utf8_database():
    """Créer une base de données UTF-8"""
    
    try:
        # Connexion directe à postgres
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password='gora369',
            database='postgres'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Supprimer l'ancienne base UTF-8 si elle existe
        cursor.execute("DROP DATABASE IF EXISTS Hotels_db_utf8")
        print("Ancienne base UTF-8 supprimée")
        
        # Créer la nouvelle base UTF-8
        cursor.execute("""
            CREATE DATABASE Hotels_db_utf8 
            WITH ENCODING 'UTF8' 
            LC_COLLATE='French_France.1252' 
            LC_CTYPE='French_France.1252'
        """)
        print("Nouvelle base UTF-8 créée")
        
        cursor.close()
        conn.close()
        
        print("Base de données Hotels_db_utf8 créée avec succès!")
        return True
        
    except Exception as e:
        print(f"Erreur: {e}")
        return False

if __name__ == "__main__":
    create_utf8_database()

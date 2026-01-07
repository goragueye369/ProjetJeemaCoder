#!/usr/bin/env python
"""
Script pour convertir la base de données PostgreSQL de WIN1252 vers UTF-8
"""
import psycopg2
import sys
import os

def convert_database_to_utf8():
    """Convertir la base de données Hotels_db en UTF-8"""
    
    # Connexion à PostgreSQL (base postgres par défaut)
    try:
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password='gora369',
            database='postgres'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("Connexion à PostgreSQL réussie")
        
        # Vérifier si la base existe
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'Hotels_db'")
        if not cursor.fetchone():
            print("La base de données 'Hotels_db' n'existe pas")
            return False
            
        # Supprimer la base existante
        print("Suppression de la base de données existante...")
        cursor.execute("DROP DATABASE IF EXISTS Hotels_db_temp")
        cursor.execute("DROP DATABASE IF EXISTS Hotels_db_utf8")
        
        # Créer une nouvelle base avec l'encodage UTF-8
        print("Création de la base de données UTF-8...")
        cursor.execute("CREATE DATABASE Hotels_db_utf8 WITH ENCODING 'UTF8' LC_COLLATE='French_France.1252' LC_CTYPE='French_France.1252'")
        
        # Exporter les données de l'ancienne base
        print("Exportation des données...")
        os.system('pg_dump -h localhost -U postgres -W Hotels_db > backup.sql')
        
        # Importer dans la nouvelle base
        print("Importation dans la nouvelle base...")
        os.system('psql -h localhost -U postgres -W Hotels_db_utf8 < backup.sql')
        
        # Renommer les bases
        cursor.execute("ALTER DATABASE Hotels_db RENAME TO Hotels_db_old")
        cursor.execute("ALTER DATABASE Hotels_db_utf8 RENAME TO Hotels_db")
        
        print("Conversion terminée avec succès!")
        print("L'ancienne base a été renommée en 'Hotels_db_old'")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Erreur lors de la conversion: {e}")
        return False

if __name__ == "__main__":
    convert_database_to_utf8()

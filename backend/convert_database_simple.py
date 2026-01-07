#!/usr/bin/env python
"""
Script simple pour convertir la base de données PostgreSQL en UTF-8
"""
import subprocess
import sys

def run_psql_command(command):
    """Exécuter une commande psql"""
    try:
        cmd = [
            'psql', 
            '-h', 'localhost', 
            '-U', 'postgres', 
            '-d', 'postgres',
            '-c', command
        ]
        env = {'PGPASSWORD': 'gora369'}
        result = subprocess.run(cmd, capture_output=True, text=True, env=env)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def convert_database():
    """Convertir la base de données en UTF-8"""
    
    commands = [
        "DROP DATABASE IF EXISTS Hotels_db_utf8;",
        "CREATE DATABASE Hotels_db_utf8 WITH ENCODING 'UTF8' LC_COLLATE='French_France.1252' LC_CTYPE='French_France.1252';",
        "ALTER DATABASE Hotels_db RENAME TO Hotels_db_old;",
        "ALTER DATABASE Hotels_db_utf8 RENAME TO Hotels_db;"
    ]
    
    print("Conversion de la base de données Hotels_db vers UTF-8...")
    
    for i, cmd in enumerate(commands, 1):
        print(f"{i}. Exécution: {cmd}")
        success, stdout, stderr = run_psql_command(cmd)
        
        if not success:
            print(f"Erreur: {stderr}")
            return False
        else:
            print("Succès!")
    
    print("\nConversion terminée avec succès!")
    print("L'ancienne base est maintenant: Hotels_db_old")
    print("La nouvelle base UTF-8 est: Hotels_db")
    
    return True

if __name__ == "__main__":
    convert_database()

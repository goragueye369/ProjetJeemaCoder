"""
PostgreSQL encoding fix for Windows compatibility - Désactivé pour UTF-8
"""
import psycopg2
import sys
import os
import locale

# Fix encoding issues for PostgreSQL on Windows
if sys.platform == 'win32':
    try:
        # Set locale for French encoding
        locale.setlocale(locale.LC_ALL, 'French_Senegal.1252')
    except locale.Error:
        try:
            # Fallback to other Windows encodings
            locale.setlocale(locale.LC_ALL, 'French_France.1252')
        except locale.Error:
            pass

# Set global encoding environment variables for UTF-8
os.environ['PGCLIENTENCODING'] = 'UTF8'
os.environ['PYTHONIOENCODING'] = 'utf-8'

# Pas de patch psycopg2 pour permettre l'UTF-8
# psycopg2.connect = fixed_connect

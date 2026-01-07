@echo off
echo Conversion de la base de données Hotels_db vers UTF-8...

set PGPASSWORD=gora369

echo 1. Suppression de l'ancienne base UTF-8 si elle existe...
psql -h localhost -U postgres -d postgres -c "DROP DATABASE IF EXISTS Hotels_db_utf8;"

echo 2. Création de la nouvelle base en UTF-8...
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE Hotels_db_utf8 WITH ENCODING 'UTF8' LC_COLLATE='French_France.1252' LC_CTYPE='French_France.1252';"

echo 3. Exportation des données de l'ancienne base...
pg_dump -h localhost -U postgres --no-owner --no-privileges -f backup.sql Hotels_db

echo 4. Importation dans la nouvelle base UTF-8...
psql -h localhost -U postgres -d Hotels_db_utf8 -f backup.sql

echo 5. Sauvegarde de l'ancienne base...
psql -h localhost -U postgres -d postgres -c "ALTER DATABASE Hotels_db RENAME TO Hotels_db_old;"

echo 6. Renommage de la nouvelle base...
psql -h localhost -U postgres -d postgres -c "ALTER DATABASE Hotels_db_utf8 RENAME TO Hotels_db;"

echo Conversion terminée!
echo L'ancienne base est disponible sous le nom: Hotels_db_old
pause

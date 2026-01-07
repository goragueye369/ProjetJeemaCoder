@echo off
echo Démarrage du serveur Django avec MongoDB...
echo.

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

REM Démarrer le serveur Django
python manage.py runserver 0.0.0.0:8000

pause

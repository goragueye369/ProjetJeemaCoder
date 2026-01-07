Write-Host "Démarrage du serveur Django avec MongoDB..." -ForegroundColor Green

# Activer l'environnement virtuel
& .\venv\Scripts\Activate.ps1

# Démarrer le serveur Django
python manage.py runserver 0.0.0.0:8000

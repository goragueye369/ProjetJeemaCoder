import requests
import json

# Test d'inscription
register_data = {
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
}

print("Test d'inscription...")
try:
    response = requests.post(
        'http://127.0.0.1:8000/api/auth/register/',
        headers={'Content-Type': 'application/json'},
        data=json.dumps(register_data)
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Erreur: {e}")

print("\n" + "="*50 + "\n")

# Test de connexion avec les bons identifiants
login_data = {
    "email": "test@example.com",
    "password": "password123"
}

print("Test de connexion (bons identifiants)...")
try:
    response = requests.post(
        'http://127.0.0.1:8000/api/auth/login/',
        headers={'Content-Type': 'application/json'},
        data=json.dumps(login_data)
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Erreur: {e}")

print("\n" + "="*50 + "\n")

# Test de connexion avec mauvais identifiants
login_data_wrong = {
    "email": "wrong@example.com",
    "password": "wrongpassword"
}

print("Test de connexion (mauvais identifiants)...")
try:
    response = requests.post(
        'http://127.0.0.1:8000/api/auth/login/',
        headers={'Content-Type': 'application/json'},
        data=json.dumps(login_data_wrong)
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Erreur: {e}")

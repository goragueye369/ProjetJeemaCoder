import requests

# Récupérer les hôtels depuis l'API
response = requests.get('http://localhost:8000/api/hotels/')
hotels = response.json()

print("=== Hôtels avec images ===")
for hotel in hotels:
    print(f"Nom: {hotel['name']}")
    print(f"Image URL: {hotel.get('image_url', 'None')}")
    print("---")

# Tester l'accès à une image
for hotel in hotels:
    if hotel.get('image_url'):
        image_url = f"http://localhost:8000{hotel['image_url']}"
        print(f"Test accès image: {image_url}")
        try:
            img_response = requests.get(image_url)
            print(f"Status: {img_response.status_code}")
            if img_response.status_code == 200:
                print("✅ Image accessible")
            else:
                print("❌ Image non accessible")
        except Exception as e:
            print(f"❌ Erreur: {e}")
        break  # Juste tester la première image trouvée

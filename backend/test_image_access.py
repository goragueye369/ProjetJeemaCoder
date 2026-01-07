import requests

# Test d'accès direct à une image
image_url = "http://localhost:8000/media/hotel_images/hotel_695d880dff4ec43a9f4a233c_641fdc1c.jpg"

print(f"Test d'accès à l'image: {image_url}")
try:
    response = requests.get(image_url)
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
    print(f"Content-Length: {response.headers.get('Content-Length', 'N/A')}")
    if response.status_code == 200:
        print("✅ Image accessible")
    else:
        print(f"❌ Erreur: {response.text[:200]}")
except Exception as e:
    print(f"❌ Exception: {e}")

# Test de l'API hotels
api_url = "http://localhost:8000/api/hotels/"
print(f"\nTest de l'API: {api_url}")
try:
    response = requests.get(api_url)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if data and len(data) > 0:
            first_hotel = data[0]
            print(f"Premier hôtel: {first_hotel.get('name', 'N/A')}")
            print(f"Image URL: {first_hotel.get('image_url', 'N/A')}")
        else:
            print("❌ Aucun hôtel trouvé")
    else:
        print(f"❌ Erreur API: {response.text[:200]}")
except Exception as e:
    print(f"❌ Exception API: {e}")

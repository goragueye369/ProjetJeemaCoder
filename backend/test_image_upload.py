import os
import requests
from PIL import Image
import io

# Créer une image de test
def create_test_image():
    # Créer une image simple (64x64 pixels)
    img = Image.new('RGB', (64, 64), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes

# Tester l'upload d'image
def test_image_upload():
    # Créer l'image de test
    image_data = create_test_image()
    
    # Préparer les données du formulaire
    files = {
        'image': ('test_image.jpg', image_data, 'image/jpeg')
    }
    
    data = {
        'name': 'Test Hotel avec Image',
        'description': 'Hotel de test avec image',
        'address': 'Test Address',
        'city': 'Test City',
        'country': 'Sénégal',
        'email': 'test@example.com',
        'price_per_night': '25000.00',
        'currency': 'XOF',
        'rating': '4.0',
        'is_active': 'True'
    }
    
    # Envoyer la requête
    try:
        response = requests.post(
            'http://localhost:8000/api/hotels/',
            files=files,
            data=data
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Vérifier si l'image a été uploadée
        if response.status_code == 201:
            hotel_data = response.json()
            print(f"Image field: {hotel_data.get('image')}")
            
            # Vérifier si le fichier existe
            if hotel_data.get('image'):
                image_url = hotel_data['image']
                print(f"Image URL: {image_url}")
                
                # Tester si l'URL est accessible
                img_response = requests.get(f'http://localhost:8000{image_url}')
                print(f"Image accessible: {img_response.status_code == 200}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_image_upload()

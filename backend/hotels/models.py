from mongoengine import Document, StringField, EmailField, URLField, DecimalField, BooleanField, DateTimeField, ReferenceField, CASCADE
from django.utils.text import slugify

class Hotel(Document):
    name = StringField(max_length=200, required=True)
    description = StringField()
    address = StringField(max_length=500, required=True)
    city = StringField(max_length=100, required=True)
    country = StringField(max_length=100, default='Sénégal')
    email = EmailField(required=True)
    phone = StringField(max_length=20)
    website = StringField(max_length=200, required=False)
    price_per_night = DecimalField(max_digits=10, decimal_places=2, required=True)
    currency = StringField(max_length=3, default='XOF')
    rating = DecimalField(max_digits=3, decimal_places=1, default=0.0)
    is_active = BooleanField(default=True)
    image = StringField(max_length=255, required=False)  # Stocke le nom du fichier
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    slug = StringField(unique=True)

    meta = {
        'ordering': ['-created_at'],
        'collection': 'hotels',
        'indexes': []  # Index désactivés pour éviter l'erreur d'authentification
    }

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Générer un slug unique
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Hotel.objects.filter(slug=slug).first():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

class Room(Document):
    hotel = ReferenceField(Hotel, reverse_delete_rule=CASCADE, required=True)
    room_number = StringField(max_length=10, required=True)
    room_type = StringField(max_length=50, required=True)
    capacity = StringField(required=True)
    price_per_night = DecimalField(max_digits=10, decimal_places=2, required=True)
    is_available = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    meta = {
        'collection': 'rooms',
        'indexes': []  # Index désactivés pour éviter l'erreur d'authentification
    }

    def __str__(self):
        return f"{self.hotel.name} - Chambre {self.room_number}"

class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True)
    first_name = StringField()
    last_name = StringField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)

    meta = {
        'collection': 'users',
        'indexes': []  # Index désactivés pour éviter l'erreur d'authentification
    }

    def __str__(self):
        return self.username

class Booking(Document):
    hotel = ReferenceField(Hotel, reverse_delete_rule=CASCADE, required=True)
    user = ReferenceField(User, required=True)
    room = ReferenceField(Room, reverse_delete_rule=CASCADE, required=True)
    check_in = DateTimeField(required=True)
    check_out = DateTimeField(required=True)
    total_price = DecimalField(max_digits=10, decimal_places=2, required=True)
    status = StringField(max_length=20, default='pending')
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    meta = {
        'ordering': ['-created_at'],
        'collection': 'bookings',
        'indexes': []  # Index désactivés pour éviter l'erreur d'authentification
    }

    def __str__(self):
        return f"{self.user.username} - {self.hotel.name} - {self.check_in.date()}"

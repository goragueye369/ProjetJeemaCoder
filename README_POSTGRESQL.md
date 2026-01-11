# Migration vers PostgreSQL - Guide d'Installation

## 🚀 Configuration de PostgreSQL pour votre projet Django

### Étape 1: Installation de PostgreSQL

#### Windows
1. Téléchargez PostgreSQL depuis https://postgresql.org/download/windows/
2. Lancez l'installateur et notez le mot de passe que vous définissez
3. Assurez-vous que le service PostgreSQL est en cours d'exécution

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Étape 2: Configuration de la base de données

1. **Configurez le script de setup:**
   - Modifiez les identifiants dans `setup_postgresql.py` si nécessaire
   - Par défaut: utilisateur `postgres`, mot de passe `password`

2. **Exécutez le script de configuration:**
   ```bash
   cd backend
   python setup_postgresql.py
   ```

### Étape 3: Installation des dépendances Python

```bash
cd backend
pip install -r requirements.txt
```

### Étape 4: Migration des données

1. **Créez les migrations:**
   ```bash
   python manage.py makemigrations
   ```

2. **Appliquez les migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Créez un superutilisateur:**
   ```bash
   python manage.py createsuperuser
   ```

### Étape 5: Configuration des variables d'environnement (Optionnel)

1. Copiez le fichier d'exemple:
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` avec vos véritables identifiants PostgreSQL

### Étape 6: Test du serveur

```bash
python manage.py runserver
```

## 📁 Fichiers modifiés

- `config/settings.py` - Configuration PostgreSQL
- `hotels/models.py` - Migration de MongoEngine vers Django ORM
- `requirements.txt` - Dépendances PostgreSQL
- `setup_postgresql.py` - Script d'automatisation

## 🔧 Modifications principales

### Models Django ORM
- **Hotel**: `models.Model` avec champs Django standards
- **Room**: ForeignKey vers Hotel
- **User**: Hérite de `AbstractUser` pour l'authentification Django
- **Booking**: Relations ForeignKey avec choices de statut

### Avantages de PostgreSQL
- ✅ Support natif Django
- ✅ Migrations automatiques
- ✅ Relations SQL robustes
- ✅ Performances optimisées
- ✅ Sécurité accrue

## 🚨 Points d'attention

1. **Mot de passe PostgreSQL**: Changez le mot de passe par défaut dans les settings
2. **Images**: Les champs image utilisent maintenant `ImageField` de Django
3. **Relations**: Les références MongoEngine sont remplacées par des ForeignKey
4. **Migrations**: Pensez à sauvegarder vos données MongoDB avant la migration

## 📞 Support

En cas de problème:
1. Vérifiez que PostgreSQL est installé et démarré
2. Vérifiez les identifiants dans `settings.py`
3. Consultez les logs d'erreur Django

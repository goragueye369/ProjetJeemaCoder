// Configuration de l'application
const config = {
  // URL de l'API - changez selon l'environnement
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://projetjeemacoder.onrender.com/api' 
    : 'http://localhost:8000/api',
  
  // URL de base pour les images
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://projetjeemacoder.onrender.com'
    : 'http://localhost:8000',
}

export default config

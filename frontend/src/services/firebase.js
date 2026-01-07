import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth'

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkY8z7X4X2X3m9l5Q6R7t8W9n",
  authDomain: "projetjeemacoder.firebaseapp.com",
  projectId: "projetjeemacoder",
  storageBucket: "projetjeemacoder.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Service d'authentification Firebase
export const firebaseAuthService = {
  // Inscription
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Obtenir le token JWT
      const token = await user.getIdToken()
      
      // Stocker dans localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        username: user.email.split('@')[0],
        first_name: '',
        last_name: '',
        is_active: true
      }))
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          username: user.email.split('@')[0],
          first_name: '',
          last_name: '',
          is_active: true
        },
        token: token
      }
    } catch (error) {
      console.error('Erreur d\'inscription Firebase:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Connexion
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Obtenir le token JWT
      const token = await user.getIdToken()
      
      // Stocker dans localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        username: user.email.split('@')[0],
        first_name: '',
        last_name: '',
        is_active: true
      }))
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          username: user.email.split('@')[0],
          first_name: '',
          last_name: '',
          is_active: true
        },
        token: token
      }
    } catch (error) {
      console.error('Erreur de connexion Firebase:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      console.error('Erreur de déconnexion Firebase:', error)
      return { success: false, error: error.message }
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { 
        success: true, 
        message: 'Email de réinitialisation envoyé avec succès' 
      }
    } catch (error) {
      console.error('Erreur de réinitialisation:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: () => {
    const user = auth.currentUser
    if (user) {
      return {
        id: user.uid,
        email: user.email,
        username: user.email.split('@')[0],
        first_name: '',
        last_name: '',
        is_active: true
      }
    }
    return null
  },

  // Observer les changements d'authentification
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback)
  }
}

export default auth

import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        console.log('AuthContext - Utilisateur restauré depuis localStorage:', parsedUser)
      } catch (error) {
        console.error('AuthContext - Erreur parsing localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
    console.log('AuthContext - Initialisation terminée')
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      console.log('AuthContext - Tentative de connexion avec:', credentials.email)
      
      const response = await authService.login(credentials)
      console.log('AuthContext - Login response:', response)
      
      // Axios met les données dans response.data
      const result = response.data
      console.log('AuthContext - Resultat extrait de response.data:', result)
      
      if (result.success) {
        const userData = result.user
        const token = result.token
        
        setUser(userData)
        setIsAuthenticated(true)
        
        // Sauvegarder dans localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        
        console.log('AuthContext - User:', userData)
        console.log('AuthContext - Token:', token)
        console.log('AuthContext - User ID:', userData.id)
        console.log('AuthContext - User Email:', userData.email)
        
        return { success: true, user: userData, token }
      } else {
        console.log('AuthContext - Login failed:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('AuthContext - Login error:', error)
      return { success: false, error: 'Erreur de connexion' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      console.log('AuthContext - Tentative d\'inscription avec:', userData.email)
      
      const response = await authService.register(userData)
      console.log('AuthContext - Register response:', response)
      
      if (response.success) {
        return { success: true, user: response.user, token: response.token }
      } else {
        console.log('AuthContext - Register failed:', response.error)
        return { success: false, error: response.error, type: response.type }
      }
    } catch (error) {
      console.error('AuthContext - Register error:', error)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('AuthContext - Déconnexion')
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    userId: user?.id,
    userEmail: user?.email
  }

  console.log('AuthContext - Provider value:', value)
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

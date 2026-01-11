import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('🔒 ProtectedRoute - État actuel:', { user, loading, isAuthenticated: !!user })
  console.log('🔒 ProtectedRoute - User ID:', user?.id)
  console.log('🔒 ProtectedRoute - User Email:', user?.email)

  // Si le chargement est en cours, afficher un spinner
  if (loading) {
    console.log('🔄 ProtectedRoute - Loading, affichage spinner')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    console.log('❌ ProtectedRoute - User null, redirection vers /login')
    return <Navigate to="/login" replace />
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  console.log('✅ ProtectedRoute - User connecté, affichage contenu protégé')
  return children
}

export default ProtectedRoute

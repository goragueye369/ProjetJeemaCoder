import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Si le chargement est en cours, afficher un spinner
  if (loading) {
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
    // Sauvegarder la destination souhaitée pour la redirection après connexion
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return children
}

export default ProtectedRoute

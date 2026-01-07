import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { firebaseAuthService } from '../services/firebase'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState('jwt') // 'jwt' ou 'firebase'
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Récupérer la destination de redirection depuis l'état de navigation
  const from = location.state?.from?.pathname || '/dashboard'

  // Afficher le message de succès si provenant de l'inscription
  const [successMessage, setSuccessMessage] = useState('')
  
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      if (location.state.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }))
      }
    }
  }, [location.state])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let result
    if (authMethod === 'firebase') {
      // Utiliser Firebase
      result = await firebaseAuthService.login(formData.email, formData.password)
    } else {
      // Utiliser JWT (backend Django)
      result = await login(formData)
    }
    
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Email ou mot de passe incorrect')
    }
    
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Veuillez entrer votre email pour réinitialiser le mot de passe')
      return
    }

    if (authMethod === 'firebase') {
      const result = await firebaseAuthService.resetPassword(formData.email)
      if (result.success) {
        setError('')
        alert('Email de réinitialisation envoyé avec succès!')
      } else {
        setError(result.error)
      }
    } else {
      setError('La réinitialisation du mot de passe est uniquement disponible avec Firebase')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">RED PRODUCT</h2>
          <h3 className="text-xl text-gray-700 mb-6">Connectez-vous en tant que Admin</h3>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Message de succès */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 4 4 0 008 8zm3.707 9.293a1 1 0 00-1.414 1.414l-4.293 4.293a1 1 0 001.414-1.414L10 5.586z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Inscription réussie !
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{successMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message d'information */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Authentification requise
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Vous devez être connecté pour accéder à l'application. 
                    Si vous n'avez pas de compte, {' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                      créez-en un ici
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sélection du mode d'authentification */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => setAuthMethod('jwt')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  authMethod === 'jwt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                JWT (Backend)
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('firebase')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  authMethod === 'firebase'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Firebase
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {authMethod === 'jwt' 
                ? 'Authentification via le backend Django avec JWT'
                : 'Authentification via Firebase Authentication'
              }
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Votre e-mail"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="•••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  authMethod === 'firebase'
                    ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {loading ? 'Connexion...' : `Se connecter avec ${authMethod === 'firebase' ? 'Firebase' : 'JWT'}`}
              </button>
            </div>
          </form>

          {authMethod === 'firebase' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Mot de passe oublié?
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte?{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

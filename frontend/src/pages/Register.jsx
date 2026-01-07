import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { firebaseAuthService } from '../services/firebase'

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState('jwt') // 'jwt' ou 'firebase'
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Récupérer la destination de redirection depuis l'état de navigation
  const from = location.state?.from?.pathname || '/dashboard'

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

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    let result
    if (authMethod === 'firebase') {
      // Utiliser Firebase
      result = await firebaseAuthService.register(formData.email, formData.password)
    } else {
      // Utiliser JWT (backend Django)
      result = await register(formData)
    }
    
    if (result.success) {
      // Pour JWT, rediriger vers la page de connexion après inscription réussie
      if (authMethod === 'jwt') {
        navigate('/login', { 
          state: { 
            message: 'Inscription réussie ! Veuillez vous connecter avec vos nouveaux identifiants.',
            email: formData.email 
          } 
        })
      } else {
        // Pour Firebase, rediriger directement vers le dashboard
        navigate(from, { replace: true })
      }
    } else {
      setError(result.error || 'Une erreur est survenue lors de l\'inscription')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">RED PRODUCT</h2>
          <h3 className="text-xl text-gray-700 mb-6">Inscrivez-vous en tant que Admin</h3>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Message d'information */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Créez votre compte
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Inscrivez-vous pour accéder à toutes les fonctionnalités de l'application. 
                    Si vous avez déjà un compte, {' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                      connectez-vous ici
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
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <div className="mt-1">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required={authMethod === 'jwt'}
                  value={formData.first_name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Votre nom"
                />
              </div>
            </div>

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
                  minLength={authMethod === 'firebase' ? 6 : 8}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder={authMethod === 'firebase' ? 'Min 6 caractères' : 'Min 8 caractères'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirmation mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="•••••••"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  Accepter les termes et la politique
                </label>
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
                {loading ? 'Inscription...' : `S'inscrire avec ${authMethod === 'firebase' ? 'Firebase' : 'JWT'}`}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

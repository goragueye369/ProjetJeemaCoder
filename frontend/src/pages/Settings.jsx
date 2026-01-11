import { useState, useEffect } from 'react'
import { authService } from '../services/api'

const Settings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    }
    setLoading(false)
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      // Simuler une mise à jour du profil
      setMessage('Profil mis à jour avec succès!')
      
      // Mettre à jour les données locales
      const updatedUser = {
        ...user,
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil')
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (formData.new_password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.new_password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    try {
      // Simuler une mise à jour du mot de passe
      setMessage('Mot de passe mis à jour avec succès!')
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (err) {
      setError('Erreur lors de la mise à jour du mot de passe')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <nav className="space-y-1 p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'security'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sécurité
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'preferences'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Préférences
                </button>
                <button
                  onClick={() => setActiveTab('system')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'system'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Système
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Messages */}
              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg m-6">
                  {message}
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg m-6">
                  {error}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Informations du profil</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Sécurité</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Préférences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span className="text-sm text-gray-700">Recevoir les notifications par email</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span className="text-sm text-gray-700">Notifications de réservation</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-sm text-gray-700">Newsletter mensuelle</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Langue et région</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Langue
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                            <option>Français</option>
                            <option>English</option>
                            <option>Español</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fuseau horaire
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (Paris)</option>
                            <option>UTC-5 (New York)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Informations système</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Application</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version</span>
                          <span className="text-gray-900">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Environnement</span>
                          <span className="text-gray-900">Production</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dernière mise à jour</span>
                          <span className="text-gray-900">11/01/2026</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Base de données</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="text-gray-900">PostgreSQL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut</span>
                          <span className="text-green-600">Connectée</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dernière sauvegarde</span>
                          <span className="text-gray-900">10/01/2026 23:00</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Stockage</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Images d'hôtels</span>
                          <span className="text-gray-900">2.3 GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Documents</span>
                          <span className="text-gray-900">156 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Espace libre</span>
                          <span className="text-gray-900">47.5 GB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

import { useState, useEffect } from 'react'
import { userService, bookingService } from '../services/api'

const Admins = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers()
      setUsers(response.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des administrateurs')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      try {
        await userService.deleteUser(id)
        setUsers(users.filter(user => user.id !== id))
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const handleViewDetails = async (user) => {
    try {
      const response = await userService.getUser(user.id)
      setSelectedUser(response.data)
      setShowModal(true)
    } catch (err) {
      setError('Erreur lors du chargement des détails de l\'administrateur')
    }
  }

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUserStats = (userId) => {
    // Simuler des statistiques de réservations pour chaque utilisateur
    return {
      totalBookings: Math.floor(Math.random() * 10) + 1,
      totalSpent: Math.floor(Math.random() * 5000) + 500,
      lastBooking: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Administrateurs</h1>
        </div>
      </div>

      {/* Recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un administrateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Total administrateurs</h3>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Administrateurs actifs</h3>
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Nouveaux ce mois</h3>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(u => {
                const createdAt = new Date(u.created_at)
                const thisMonth = new Date()
                return createdAt.getMonth() === thisMonth.getMonth() && 
                       createdAt.getFullYear() === thisMonth.getFullYear()
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Taux de conversion</h3>
            <p className="text-2xl font-bold text-purple-600">68%</p>
          </div>
        </div>

        {/* Liste des administrateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun administrateur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Administrateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total dépensé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const stats = getUserStats(user.id)
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.first_name?.[0] || user.username?.[0] || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.username || 'N/A'
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.totalBookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.totalSpent} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-gray-600 hover:text-gray-900 mr-3"
                          >
                            Voir
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails de l'administrateur */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails de l'administrateur</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-lg font-medium text-gray-700">
                      {selectedUser.first_name?.[0] || selectedUser.username?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedUser.first_name && selectedUser.last_name 
                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                        : selectedUser.username
                      }
                    </h4>
                    <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total réservations</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getUserStats(selectedUser.id).totalBookings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admins

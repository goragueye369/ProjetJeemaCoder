import { useState, useEffect } from 'react'
import { bookingService, hotelService, userService } from '../services/api'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [hotels, setHotels] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBookings()
    fetchHotels()
    fetchUsers()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()
      setBookings(response.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des réservations')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchHotels = async () => {
    try {
      const response = await hotelService.getAllHotels()
      setHotels(response.data)
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers()
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await bookingService.deleteBooking(id)
        setBookings(bookings.filter(booking => booking.id !== id))
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (getHotelName(booking.hotel)?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (getUserName(booking.user)?.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId)
    return hotel ? hotel.name : 'Hôtel inconnu'
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.username || user.email : 'Client inconnu'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'cancelled': return 'Annulée'
      case 'completed': return 'Terminée'
      default: return status
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
          <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtre par statut */}
          <div className="md:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
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
            <h3 className="text-sm font-medium text-gray-500">Total</h3>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">En attente</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Confirmées</h3>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Annulées</h3>
            <p className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hôtel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.id?.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getUserName(booking.user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getHotelName(booking.hotel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.total_price} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings

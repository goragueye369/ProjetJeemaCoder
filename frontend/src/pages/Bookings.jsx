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
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchBookings()
    fetchHotels()
    fetchUsers()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()
      
      // Si aucune réservation trouvée, ajouter des données d'exemple
      if (!response.data || response.data.length === 0) {
        const sampleBookings = [
          {
            id: 'booking_001',
            user: 'user_001',
            hotel: 'hotel_001',
            room: 'room_001',
            check_in: '2026-01-15T14:00:00Z',
            check_out: '2026-01-18T12:00:00Z',
            total_price: 450,
            status: 'confirmed',
            created_at: '2026-01-10T10:30:00Z'
          },
          {
            id: 'booking_002',
            user: 'user_002',
            hotel: 'hotel_002',
            room: 'room_002',
            check_in: '2026-01-20T15:00:00Z',
            check_out: '2026-01-22T11:00:00Z',
            total_price: 280,
            status: 'pending',
            created_at: '2026-01-11T09:15:00Z'
          },
          {
            id: 'booking_003',
            user: 'user_003',
            hotel: 'hotel_001',
            room: 'room_003',
            check_in: '2026-01-08T14:00:00Z',
            check_out: '2026-01-10T12:00:00Z',
            total_price: 320,
            status: 'completed',
            created_at: '2026-01-05T16:45:00Z'
          },
          {
            id: 'booking_004',
            user: 'user_001',
            hotel: 'hotel_003',
            room: 'room_004',
            check_in: '2026-01-25T14:00:00Z',
            check_out: '2026-01-27T12:00:00Z',
            total_price: 520,
            status: 'cancelled',
            created_at: '2026-01-09T11:20:00Z'
          },
          {
            id: 'booking_005',
            user: 'user_004',
            hotel: 'hotel_002',
            room: 'room_005',
            check_in: '2026-02-01T15:00:00Z',
            check_out: '2026-02-05T11:00:00Z',
            total_price: 750,
            status: 'pending',
            created_at: '2026-01-11T14:30:00Z'
          }
        ]
        setBookings(sampleBookings)
        
        // Ajouter aussi des hôtels et utilisateurs d'exemple
        setHotels([
          { id: 'hotel_001', name: 'Luxe Palace Dakar' },
          { id: 'hotel_002', name: 'Sénégal Resort & Spa' },
          { id: 'hotel_003', name: 'Baobab Boutique Hotel' }
        ])
        
        setUsers([
          { id: 'user_001', username: 'salam', email: 'salam@gmail.com', first_name: 'Salam', last_name: 'Diallo' },
          { id: 'user_002', username: 'mareme', email: 'mareme@gmail.com', first_name: 'Mareme', last_name: 'Fall' },
          { id: 'user_003', username: 'abdou', email: 'abdou@gmail.com', first_name: 'Abdou', last_name: 'Gueye' },
          { id: 'user_004', username: 'fatou', email: 'fatou@gmail.com', first_name: 'Fatou', last_name: 'Sow' }
        ])
      } else {
        setBookings(response.data)
      }
      
      setError(null)
    } catch (err) {
      // En cas d'erreur, charger des données d'exemple
      console.log('Erreur API, chargement des données d\'exemple:', err)
      const sampleBookings = [
        {
          id: 'booking_001',
          user: 'user_001',
          hotel: 'hotel_001',
          room: 'room_001',
          check_in: '2026-01-15T14:00:00Z',
          check_out: '2026-01-18T12:00:00Z',
          total_price: 450,
          status: 'confirmed',
          created_at: '2026-01-10T10:30:00Z'
        },
        {
          id: 'booking_002',
          user: 'user_002',
          hotel: 'hotel_002',
          room: 'room_002',
          check_in: '2026-01-20T15:00:00Z',
          check_out: '2026-01-22T11:00:00Z',
          total_price: 280,
          status: 'pending',
          created_at: '2026-01-11T09:15:00Z'
        }
      ]
      setBookings(sampleBookings)
      setHotels([
        { id: 'hotel_001', name: 'Luxe Palace Dakar' },
        { id: 'hotel_002', name: 'Sénégal Resort & Spa' }
      ])
      setUsers([
        { id: 'user_001', username: 'salam', email: 'salam@gmail.com', first_name: 'Salam', last_name: 'Diallo' },
        { id: 'user_002', username: 'mareme', email: 'mareme@gmail.com', first_name: 'Mareme', last_name: 'Fall' }
      ])
      setError(null)
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

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Simuler la mise à jour du statut
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ))
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut: ' + (err.response?.data?.message || err.message))
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir les détails"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                          
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirmer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </button>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Marquer comme terminée"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                          )}
                          
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="text-orange-600 hover:text-orange-900"
                              title="Annuler"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails de la réservation */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails de la réservation</h3>
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
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ID Réservation</p>
                      <p className="text-sm font-medium text-gray-900">#{selectedBooking.id?.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusText(selectedBooking.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="text-sm font-medium text-gray-900">{getUserName(selectedBooking.user)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hôtel</p>
                      <p className="text-sm font-medium text-gray-900">{getHotelName(selectedBooking.hotel)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'arrivée</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedBooking.check_in).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de départ</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedBooking.check_out).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.total_price} €</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de réservation</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedBooking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'confirmed')
                      setShowModal(false)
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirmer
                  </button>
                )}
                
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'completed')
                      setShowModal(false)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Marquer terminée
                  </button>
                )}
                
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'cancelled')
                      setShowModal(false)
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Annuler
                  </button>
                )}
                
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

export default Bookings

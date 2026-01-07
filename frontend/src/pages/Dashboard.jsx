import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { hotelService, bookingService, userService } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    bookings: 0,
    users: 0
  })
  const [recentHotels, setRecentHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Récupérer les vraies données depuis MongoDB
      const [hotelsResponse, bookingsResponse, usersResponse] = await Promise.all([
        hotelService.getAllHotels(),
        bookingService.getAllBookings(),
        userService.getAllUsers()
      ])

      const hotels = hotelsResponse.data
      const bookings = bookingsResponse.data
      const users = usersResponse.data

      // Calculer les statistiques
      const totalRooms = hotels.reduce((acc, hotel) => acc + (hotel.rooms?.length || 0), 0)
      
      setStats({
        hotels: hotels.length,
        rooms: totalRooms,
        bookings: bookings.length,
        users: users.length
      })

      // Prendre les 3 hôtels les plus récents
      setRecentHotels(hotels.slice(0, 3))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-accent' : 'text-luxury-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364 1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement du dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-background min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">Bienvenue chez Luxe Hotels - Système de Gestion Hôtelière</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-primary to-ocean rounded-luxury flex items-center justify-center text-white text-xl shadow-soft`}>
              🏨
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-button">
              {stats.hotels > 0 ? `+${stats.hotels}` : '0'}
            </span>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Hôtels</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{stats.hotels}</p>
          </div>
        </div>

        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-ocean to-primary rounded-luxury flex items-center justify-center text-white text-xl shadow-soft`}>
              🛏️
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-button">
              {stats.rooms > 0 ? `+${stats.rooms}` : '0'}
            </span>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Chambres</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{stats.rooms}</p>
          </div>
        </div>

        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-accent to-earth rounded-luxury flex items-center justify-center text-white text-xl shadow-soft`}>
              📅
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-button">
              {stats.bookings > 0 ? `+${stats.bookings}` : '0'}
            </span>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Réservations</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{stats.bookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-nature to-green-600 rounded-luxury flex items-center justify-center text-white text-xl shadow-soft`}>
              👥
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-button">
              {stats.users > 0 ? `+${stats.users}` : '0'}
            </span>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Clients</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{stats.users}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/hotels/create"
              className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary rounded-luxury hover:from-primary-100 hover:to-primary-200 hover:shadow-luxury transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-ocean rounded-luxury flex items-center justify-center text-white mr-4 shadow-soft">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Créer un hôtel</h3>
                <p className="text-text-secondary text-sm">Ajouter un nouvel hôtel</p>
              </div>
            </Link>

            <Link
              to="/hotels"
              className="flex items-center p-4 bg-white border border-luxury-200 rounded-luxury hover:border-primary hover:bg-primary-50 hover:text-primary transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-ocean to-primary rounded-luxury flex items-center justify-center text-white mr-4 shadow-soft">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Liste des hôtels</h3>
                <p className="text-text-secondary text-sm">Explorer tous les hôtels</p>
              </div>
            </Link>

            <div className="flex items-center p-4 bg-white border border-luxury-200 rounded-luxury hover:border-nature hover:bg-nature-50 hover:text-nature transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-nature to-green-600 rounded-luxury flex items-center justify-center text-white mr-4 shadow-soft">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002 2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Statistiques</h3>
                <p className="text-text-secondary text-sm">Voir les rapports</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white border border-luxury-200 rounded-luxury hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-luxury flex items-center justify-center text-white mr-4 shadow-soft">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Réservations</h3>
                <p className="text-text-secondary text-sm">Gérer les réservations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Hotels from MongoDB */}
        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Hôtels récents (MongoDB)</h2>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-sm">{stats.hotels}</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentHotels.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                Aucun hôtel trouvé dans la base de données
              </div>
            ) : (
              recentHotels.map((hotel, index) => (
                <div key={hotel.id || index} className="flex items-center justify-between p-3 bg-luxury-50 rounded-luxury hover:bg-luxury-100 transition-all duration-200 cursor-pointer">
                  {/* Image de l'hôtel */}
                  <div className="w-16 h-16 bg-gray-200 rounded-luxury mr-4 flex-shrink-0">
                    {hotel.image_url ? (
                      <img 
                        src={`http://localhost:8000${hotel.image_url}`} 
                        alt={hotel.name}
                        className="w-full h-full object-cover rounded-luxury"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-luxury">
                              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-luxury">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{hotel.name}</h4>
                    <p className="text-sm text-text-secondary truncate">{hotel.address}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex mr-2">
                        {renderStars(hotel.rating || 0)}
                      </div>
                      <span className="text-xs text-text-secondary">({hotel.rating || 0})</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-primary">{hotel.price_per_night} {hotel.currency}</p>
                    <span className={`text-xs px-2 py-1 rounded-button font-medium ${
                      hotel.is_active 
                        ? 'bg-nature-100 text-nature-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {hotel.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link 
            to="/hotels" 
            className="block w-full text-center text-sm text-primary hover:text-primary-700 font-medium py-2 bg-primary-50 rounded-luxury hover:bg-primary-100 transition-all duration-300"
          >
            Voir tous les hôtels →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

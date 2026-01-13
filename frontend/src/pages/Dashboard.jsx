import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { hotelService, bookingService, userService } from '../services/api'
import api from '../services/api'
import config from '../config/constants'

const Dashboard = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    bookings: 0,
    users: 0
  })
  const [recentHotels, setRecentHotels] = useState([])
  const [loading, setLoading] = useState(true)

  // Fonction pour gérer les erreurs d'images
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.parentElement.innerHTML = `
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
    `;
  };

  useEffect(() => {
    fetchDashboardData()
    
    // Optimiser les logs - uniquement en mode développement
    if (process.env.NODE_ENV === 'development') {
      const originalLog = console.log
      console.log = (...args) => {
        if (args[0] && typeof args[0] === 'string' && 
            (args[0].includes('Création de chambres') || 
             args[0].includes('Chambre déjà existante') ||
             args[0].includes('Erreur création chambre'))) {
          return // Ignorer les logs de création de chambres
        }
        originalLog(...args)
      }
      
      return () => {
        console.log = originalLog
      }
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Récupérer les données depuis PostgreSQL
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
      
      // Si aucune chambre, créer des chambres par défaut pour chaque hôtel (une seule fois)
      if (totalRooms === 0 && hotels.length > 0) {
        // console.log('Création de chambres par défaut pour les hôtels...')
        
        // Créer 3 chambres par hôtel en parallèle pour plus de rapidité
        const roomPromises = []
        for (const hotel of hotels) {
          for (let i = 1; i <= 3; i++) {
            roomPromises.push(
              api.post('/rooms/', {
                hotel: hotel.id,
                room_number: `${i}01`,
                room_type: i === 1 ? 'Suite' : i === 2 ? 'Double' : 'Simple',
                capacity: i === 1 ? '4' : i === 2 ? '2' : '1',
                price_per_night: i === 1 ? '250.00' : i === 2 ? '150.00' : '80.00',
                is_available: true
              }).catch(error => {
                // Ignorer les erreurs de doublons
                if (error.response?.status !== 500) {
                  // console.log(`Erreur création chambre ${i}:`, error.message)
                }
              })
            )
          }
        }
        
        // Attendre toutes les créations en parallèle
        await Promise.all(roomPromises)
        // console.log('Création de chambres terminée')
        
        // Récupérer les données mises à jour une seule fois
        setTimeout(async () => {
          try {
            const [hotelsResponse2, bookingsResponse2, usersResponse2] = await Promise.all([
              hotelService.getAllHotels(),
              bookingService.getAllBookings(),
              userService.getAllUsers()
            ])

            const hotels2 = hotelsResponse2.data
            const bookings2 = bookingsResponse2.data
            const users2 = usersResponse2.data

            const totalRooms2 = hotels2.reduce((acc, hotel) => acc + (hotel.rooms?.length || 0), 0)
            
            // console.log(`Nouvelles données - Hôtels: ${hotels2.length}, Chambres: ${totalRooms2}`)
            
            setStats({
              hotels: hotels2.length,
              rooms: totalRooms2,
              bookings: bookings2.length,
              users: users2.length
            })
          } catch (error) {
            // console.error('Erreur lors de la récupération des données mises à jour:', error)
          }
        }, 2000)
      } else {
        setStats({
          hotels: hotels.length,
          rooms: totalRooms,
          bookings: bookings.length,
          users: users.length
        })
      }

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
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07 3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Statistiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Hôtels</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-sm">{stats.hotels}</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm">Total des hôtels enregistrés</p>
          </div>

          <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Chambres</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-sm">{stats.rooms}</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm">Total des chambres disponibles</p>
          </div>

          <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Réservations</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-sm">{stats.bookings}</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm">Total des réservations</p>
          </div>

          <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Utilisateurs</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-sm">{stats.users}</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm">Total des utilisateurs</p>
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/hotels/create" 
            className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Créer un hôtel</h3>
                <p className="text-text-secondary text-sm">Ajouter un nouvel hôtel</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4m8 0l8 8-8-8z"></path>
                </svg>
              </div>
            </div>
          </Link>

          <Link 
            to="/bookings" 
            className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Réservations</h3>
                <p className="text-text-secondary text-sm">Gérer les réservations</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </Link>

          <Link 
            to="/users" 
            className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Utilisateurs</h3>
                <p className="text-text-secondary text-sm">Gérer les utilisateurs</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-ocean rounded-luxury flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h2a6 6 0 016 6v1m0 0l-3-3m0 6l3-3m-6-6v6h6"></path>
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Informations détaillées sur les hôtels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informations sur les hôtels</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Total:</span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.hotels} hôtels
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Statistiques générales</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total hôtels:</span>
                  <span className="font-medium text-gray-900">{stats.hotels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total chambres:</span>
                  <span className="font-medium text-gray-900">{stats.rooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total réservations:</span>
                  <span className="font-medium text-gray-900">{stats.bookings}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🏨 Catégories</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hôtels de luxe:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.filter(h => h.category === 'luxury').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hôtels business:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.filter(h => h.category === 'business').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resorts:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.filter(h => h.category === 'resort').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💰 Prix moyens</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix moyen:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.length > 0 
                      ? Math.round(recentHotels.reduce((acc, h) => acc + (h.price_per_night || 0), 0) / recentHotels.length)
                      : 0} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix min:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.length > 0 
                      ? Math.min(...recentHotels.map(h => h.price_per_night || 0))
                      : 0} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix max:</span>
                  <span className="font-medium text-gray-900">
                    {recentHotels.length > 0 
                      ? Math.max(...recentHotels.map(h => h.price_per_night || 0))
                      : 0} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-luxury border border-luxury-200 p-6 hover:shadow-luxury transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Hôtels récents</h2>
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
    <div key={hotel.id || index} className="flex items-center p-3 bg-luxury-50 rounded-luxury hover:bg-luxury-100 transition-all duration-200 cursor-pointer">
      {/* Image de l'hôtel */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0">
        {hotel.image_url ? (
          <img 
            src={`${config.BASE_URL}${hotel.image_url}`} 
            alt={hotel.name}
            className="w-full h-full object-cover rounded-lg"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{hotel.name}</h4>
        <p className="text-sm text-gray-600 truncate">{hotel.address}</p>
        <div className="flex items-center mt-1">
          <div className="flex mr-2">
            {renderStars(hotel.rating || 0)}
          </div>
          <span className="text-xs text-gray-600">({hotel.rating || 0})</span>
        </div>
      </div>
      <div className="text-right ml-2 flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{hotel.price_per_night} {hotel.currency}</p>
        <span className={`text-xs px-2 py-1 rounded font-medium block ${
          hotel.is_active 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {hotel.is_active ? 'Actif' : 'Inactif'}
        </span>
      </div>
    </div>
  ))}
            )}
          </div>
          <Link 
            to="/hotels" 
            className="block text-center mt-6 text-gray-900 hover:text-gray-600 transition-colors font-medium"
          >
            Voir tous les hôtels →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

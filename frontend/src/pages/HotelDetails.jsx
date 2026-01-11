import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { hotelService } from '../services/api'

const HotelDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHotelDetails()
  }, [id])

  const fetchHotelDetails = async () => {
    try {
      setLoading(true)
      const response = await hotelService.getHotel(id)
      let hotelData = response.data
      
      // Ajouter des données d'exemple pour les chambres si elles n'existent pas
      if (!hotelData.rooms || hotelData.rooms.length === 0) {
        hotelData.rooms = [
          {
            id: 'room_001',
            type: 'Chambre Standard',
            price: 89,
            capacity: 2,
            available: true,
            amenities: ['WiFi', 'Climatisation', 'TV', 'Salle de bain privée']
          },
          {
            id: 'room_002',
            type: 'Chambre Double',
            price: 120,
            capacity: 2,
            available: true,
            amenities: ['WiFi', 'Climatisation', 'TV', 'Salle de bain privée', 'Mini-bar']
          },
          {
            id: 'room_003',
            type: 'Suite Deluxe',
            price: 250,
            capacity: 4,
            available: true,
            amenities: ['WiFi', 'Climatisation', 'TV', 'Salle de bain privée', 'Mini-bar', 'Balcon', 'Vue mer']
          },
          {
            id: 'room_004',
            type: 'Chambre Familiale',
            price: 180,
            capacity: 4,
            available: false,
            amenities: ['WiFi', 'Climatisation', 'TV', 'Salle de bain privée', 'Mini-bar', 'Espace enfants']
          },
          {
            id: 'room_005',
            type: 'Chambre Single',
            price: 65,
            capacity: 1,
            available: true,
            amenities: ['WiFi', 'Climatisation', 'TV', 'Salle de bain privée']
          }
        ]
      }
      
      setHotel(hotelData)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des détails de l\'hôtel')
      console.error('Error fetching hotel details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/hotels/edit/${id}`)
  }

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      try {
        await hotelService.deleteHotel(id)
        navigate('/hotels')
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message))
        console.error('Error deleting hotel:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong>Erreur:</strong> {error}
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Hôtel non trouvé</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/hotels')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Retour aux hôtels
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image principale */}
          <div className="h-96 bg-gray-100">
            {hotel.image_url ? (
              <img 
                src={hotel.image_url.startsWith('/') ? `http://127.0.0.1:8000${hotel.image_url}` : hotel.image_url} 
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <p class="mt-2 text-sm text-gray-500">Image non disponible</p>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Aucune image</p>
                </div>
              </div>
            )}
          </div>

          {/* Informations détaillées */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      hotel.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hotel.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {hotel.category || 'Standard'}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {hotel.description || 'Aucune description disponible pour cet hôtel.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations générales</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="text-gray-500 w-24">Adresse:</span>
                      <span className="text-gray-900">{hotel.address || 'Non spécifiée'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-24">Ville:</span>
                      <span className="text-gray-900">{hotel.city || 'Non spécifiée'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-24">Pays:</span>
                      <span className="text-gray-900">{hotel.country || 'Non spécifié'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-24">Email:</span>
                      <span className="text-gray-900">{hotel.email || 'Non spécifié'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-24">Téléphone:</span>
                      <span className="text-gray-900">{hotel.phone || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tarifs et disponibilités</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Prix par nuit:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {hotel.price_per_night || '0'} {hotel.currency || '€'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Nombre d'étoiles:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < (hotel.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07 3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {hotel.rooms && hotel.rooms.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Chambres disponibles</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hotel.rooms.filter(room => room.available).length} / {hotel.rooms.length} disponibles
                      </span>
                    </div>
                    <div className="space-y-3">
                      {hotel.rooms.slice(0, 3).map((room, index) => (
                        <div key={room.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{room.type || 'Chambre standard'}</h4>
                              <p className="text-sm text-gray-600">Capacité: {room.capacity || 2} personne{(room.capacity || 2) > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">{room.price || '0'} €</span>
                              <p className="text-xs text-gray-500">par nuit</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                                <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-gray-300">
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities && room.amenities.length > 3 && (
                                <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              room.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {room.available ? 'Disponible' : 'Occupée'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {hotel.rooms.length > 3 && (
                        <div className="text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir les {hotel.rooms.length - 3} autres chambres →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetails

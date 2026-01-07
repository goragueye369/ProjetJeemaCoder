import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hotelService } from '../services/api'

function HotelsList() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await hotelService.getAllHotels()
      console.log('Données brutes reçues:', response.data)
      setHotels(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setError('Erreur lors du chargement des hôtels: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      try {
        await hotelService.deleteHotel(id)
        setHotels(hotels.filter(hotel => hotel.id !== id))
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message))
        console.error('Error deleting hotel:', err)
      }
    }
  }

  const handleEdit = (hotelId) => {
    navigate(`/hotels/edit/${hotelId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Erreur:</strong> {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des Hôtels</h1>
      
      {hotels.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Aucun hôtel trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            console.log(`Hotel ${hotel.name}: image_url = ${hotel.image_url}`);
            return (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image de l'hôtel */}
              <div className="h-48 bg-gray-200 relative">
                {hotel.image_url ? (
                  <img 
                    src={hotel.image_url} 
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image load error for:', hotel.name, 'URL:', hotel.image_url);
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                          <div class="text-center">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <p class="mt-2 text-sm text-gray-500">Aucune image</p>
                          </div>
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
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    hotel.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {hotel.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
                <p className="text-gray-600 mb-2">{hotel.description}</p>
                
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Ville:</span> {hotel.city}</p>
                  <p><span className="font-medium">Pays:</span> {hotel.country}</p>
                  <p><span className="font-medium">Email:</span> {hotel.email}</p>
                  <p><span className="font-medium">Prix/nuit:</span> {hotel.price_per_night} {hotel.currency}</p>
                  <p><span className="font-medium">Note:</span> {hotel.rating}/5</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleEdit(hotel.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
      
      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Nombre d'hôtels chargés: {hotels.length}</p>
        <p>Erreur: {error || 'Aucune'}</p>
      </div>
    </div>
  )
}

export default HotelsList

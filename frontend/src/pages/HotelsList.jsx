import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { hotelService } from '../services/api'

function HotelsList() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  // URL du backend pour les images
  const BACKEND_URL = 'http://127.0.0.1:8000'

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

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || hotel.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'luxury', 'business', 'resort', 'boutique']

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Filtres et recherche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un hôtel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            />
          </div>
          
          {/* Filtre par catégorie */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grille d'hôtels moderne */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : error ? (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded mb-8">
            <strong>Erreur:</strong> {error}
          </div>
        ) : (
          <>
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun hôtel trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => {
                  console.log(`Hotel ${hotel.name}: image_url = ${hotel.image_url}`);
                  return (
                    <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      {/* Image de l'hôtel plus grande */}
                      <div className="h-64 bg-gray-100">
                        {hotel.image_url ? (
                          <img 
                            src={hotel.image_url.startsWith('/') ? `${BACKEND_URL}${hotel.image_url}` : hotel.image_url} 
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onLoad={() => console.log(`Image loaded successfully: ${hotel.name}`)}
                            onError={(e) => {
                              console.log('Image load error for:', hotel.name, 'URL:', hotel.image_url);
                              const finalUrl = hotel.image_url.startsWith('/') ? `${BACKEND_URL}${hotel.image_url}` : hotel.image_url;
                              console.log('Tentative URL:', finalUrl);
                              // Afficher le placeholder si erreur
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
                      
                      {/* Contenu très minimal */}
                      <div className="p-2 pb-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2">
                          {hotel.description ? hotel.description.substring(0, 40) + '...' : 'Hôtel de qualité'}
                        </p>
                        
                        {/* Prix et boutons */}
                        <div className="flex flex-col space-y-2">
                          <div>
                            <span className="text-base font-bold text-gray-900">
                              {hotel.price_per_night || '0'} {hotel.currency || '€'}
                            </span>
                            <p className="text-xs text-gray-500">par nuit</p>
                          </div>
                          
                          {/* Boutons d'action plus grands */}
                          <div className="flex space-x-1 w-full">
                            <button
                              onClick={() => handleEdit(hotel.id)}
                              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200 font-medium text-xs"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => navigate(`/hotels/${hotel.id}`)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200 font-medium text-xs"
                            >
                              Détails
                            </button>
                            <button
                              onClick={() => handleDelete(hotel.id)}
                              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded hover:bg-black transition-colors duration-200 font-medium text-xs"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default HotelsList

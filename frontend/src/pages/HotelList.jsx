import { useState } from 'react'
import { Link } from 'react-router-dom'

const HotelList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data pour les hôtels
  const hotels = [
    {
      id: 1,
      name: 'Hôtel Terrou-Bi',
      address: 'Boulevard Martin Luther King Dakar, 11500',
      price: '25.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Terrou-Bi',
      rating: 4.5,
      status: 'Actif',
      rooms: 120
    },
    {
      id: 2,
      name: 'King Fahd Palace',
      address: 'Rte des Almadies, Dakar',
      price: '20.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=King+Fahd',
      rating: 4.8,
      status: 'Actif',
      rooms: 200
    },
    {
      id: 3,
      name: 'Radisson Blu Hotel',
      address: 'Rte de la Corniche O, Dakar 16868',
      price: '22.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Radisson',
      rating: 4.3,
      status: 'Actif',
      rooms: 150
    },
    {
      id: 4,
      name: 'Pullman Dakar Teranga',
      address: 'Place de l\'Independence, 10 Rue PL 29, Dakar',
      price: '30.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Pullman',
      rating: 4.6,
      status: 'Actif',
      rooms: 180
    },
    {
      id: 5,
      name: 'Hôtel Lac Rose',
      address: 'Lac Rose, Dakar',
      price: '25.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Lac+Rose',
      rating: 4.2,
      status: 'Actif',
      rooms: 80
    },
    {
      id: 6,
      name: 'Hôtel Saly',
      address: 'Mbour, Sénégal BP64, Saly 23000',
      price: '20.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Saly',
      rating: 4.4,
      status: 'Actif',
      rooms: 100
    },
    {
      id: 7,
      name: 'Palm Beach Resort & Spa',
      address: 'Place de l\'Independence, 10 Rue PL 29, Dakar',
      price: '22.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Palm+Beach',
      rating: 4.7,
      status: 'Actif',
      rooms: 90
    },
    {
      id: 8,
      name: 'Pullman Dakar Teranga',
      address: 'Place de l\'Independence, 10 Rue PL 29, Dakar',
      price: '30.000',
      currency: 'XOF',
      image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Pullman+2',
      rating: 4.6,
      status: 'Actif',
      rooms: 180
    }
  ]

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Liste des hôtels</h1>
            <p className="text-gray-600 mt-2">Gérez tous vos hôtels ({filteredHotels.length} hôtels)</p>
          </div>
          <Link
            to="/hotels/create"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer un nouvel hôtel
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Rechercher un hôtel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
              </svg>
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {hotel.status}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-red-600 transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(hotel.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({hotel.rating})</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{hotel.address}</p>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-red-600">{hotel.price} {hotel.currency}</p>
                  <p className="text-gray-500 text-sm">par nuit</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{hotel.rooms} chambres</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Modifier">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors" title="Supprimer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 transition-colors" title="Voir détails">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hôtel trouvé</h3>
          <p className="text-gray-500 mb-4">Aucun hôtel ne correspond à votre recherche "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Effacer la recherche
          </button>
        </div>
      )}
    </div>
  )
}

export default HotelList

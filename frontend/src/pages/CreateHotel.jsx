import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hotelService } from '../services/api'
import api from '../services/api'

const CreateHotel = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'Sénégal',
    email: '',
    phone: '',
    website: '',
    price_per_night: '',
    currency: 'XOF',
    rating: '0.0',
    is_active: true,
    image: null,
    number_of_rooms: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currencies = [
    { code: 'XOF', symbol: 'XOF', name: 'Franc CFA' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar' }
  ]

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Créer un objet FormData pour l'upload d'image
      const dataToSend = new FormData()
      
      // Ajouter tous les champs sauf l'image
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          dataToSend.append(key, formData[key])
        }
      })
      
      // Ajouter l'image si elle existe
      if (formData.image) {
        dataToSend.append('image', formData.image)
      }

      // Debug: afficher le contenu de FormData
      console.log('FormData contenu:')
      for (let [key, value] of dataToSend.entries()) {
        console.log(key, value)
      }
      
      // Envoyer à l'API
      const response = await hotelService.createHotel(dataToSend)
      console.log('Réponse de l\'API:', response.data)
      
      // Créer automatiquement les chambres si un nombre est spécifié
      if (formData.number_of_rooms && formData.number_of_rooms > 0) {
        const hotelId = response.data.id
        console.log(`Création de ${formData.number_of_rooms} chambres pour l'hôtel ${hotelId}`)
        
        for (let i = 1; i <= formData.number_of_rooms; i++) {
          try {
            await api.post('/rooms/', {
              hotel: hotelId,
              room_number: `${i}01`,
              room_type: i === 1 ? 'Suite' : i === 2 ? 'Double' : 'Simple',
              capacity: i === 1 ? '4' : i === 2 ? '2' : '1',
              price_per_night: i === 1 ? '250.00' : i === 2 ? '150.00' : '80.00',
              is_available: true
            })
          } catch (error) {
            console.log(`Erreur création chambre ${i}:`, error)
          }
        }
      }
      
      // Redirection immédiate en cas de succès
      navigate('/hotels')
      
    } catch (err) {
      console.error('Erreur détaillée:', err)
      console.error('Response data:', err.response?.data)
      console.error('Response status:', err.response?.status)
      console.error('Response headers:', err.response?.headers)
      
      // Afficher tous les détails de l'erreur
      if (err.response?.data) {
        const errorDetails = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        setError(`Erreur de validation: ${errorDetails}`)
      } else {
        setError('Une erreur est survenue lors de la création de l\'hôtel: ' + (err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer un nouvel hôtel</h1>
        <p className="text-gray-600 mt-2">Ajoutez un nouvel hôtel à votre base de données</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              <strong>Erreur:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de l'hôtel */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'hôtel *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Entrez le nom de l'hôtel"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Description de l'hôtel"
              />
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Entrez l'adresse complète"
              />
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Dakar"
              />
            </div>

            {/* Pays */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Sénégal"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="information@hotel.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+221 777 777 77"
              />
            </div>

            {/* Nombre de chambres */}
            <div>
              <label htmlFor="number_of_rooms" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de chambres *
              </label>
              <input
                type="number"
                id="number_of_rooms"
                name="number_of_rooms"
                required
                value={formData.number_of_rooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="10"
                min="1"
              />
            </div>

            {/* Prix et Devise */}
            <div>
              <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700 mb-2">
                Prix par nuit
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="price_per_night"
                  name="price_per_night"
                  required
                  value={formData.price_per_night}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="25000"
                />
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Ajouter une photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Cliquez pour télécharger une image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF jusqu'à 10MB
                  </p>
                </label>
                {formData.image && (
                  <p className="mt-2 text-sm text-green-600">
                    Image sélectionnée: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/hotels')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateHotel

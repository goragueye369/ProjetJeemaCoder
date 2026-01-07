import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hotelService } from '../services/api'

function EditHotel() {
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
    image: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchHotel()
  }, [id])

  const fetchHotel = async () => {
    try {
      const response = await hotelService.getHotel(id)
      const hotel = response.data
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        address: hotel.address || '',
        city: hotel.city || '',
        country: hotel.country || 'Sénégal',
        email: hotel.email || '',
        phone: hotel.phone || '',
        website: hotel.website || '',
        price_per_night: hotel.price_per_night || '',
        currency: hotel.currency || 'XOF',
        rating: hotel.rating || '0.0',
        is_active: hotel.is_active !== false,
        image: null
      })
      setLoading(false)
    } catch (err) {
      setError('Erreur lors du chargement de l\'hôtel: ' + (err.response?.data?.message || err.message))
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs sauf image si elle est vide
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          // N'ajouter l'image que si un fichier est sélectionné
          if (formData[key] && formData[key] instanceof File) {
            formDataToSend.append(key, formData[key])
          }
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      console.log('FormData contenu:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value)
      }

      const response = await hotelService.updateHotel(id, formDataToSend)
      console.log('Réponse de l\'API:', response)
      
      setSuccess('Hôtel modifié avec succès!')
      setTimeout(() => {
        navigate('/hotels')
      }, 2000)
    } catch (err) {
      console.error('Erreur détaillée:', err)
      if (err.response) {
        console.error('Response data:', err.response.data)
        console.error('Response status:', err.response.status)
        console.error('Response headers:', err.response.headers)
        setError(`Erreur ${err.response.status}: ${err.response.data?.detail || err.response.data?.message || 'Erreur inconnue'}`)
      } else {
        setError('Erreur: ' + err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Modifier l'Hôtel</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Succès:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'hôtel *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Adresse */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pays */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Site web */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix par nuit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix par nuit *
            </label>
            <input
              type="number"
              name="price_per_night"
              value={formData.price_per_night}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Devise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise *
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="XOF">XOF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (0-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Hôtel actif
            </label>
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de l'hôtel
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.image && (
                <span className="text-sm text-gray-600">
                  {formData.image.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md"
          >
            {submitting ? 'Modification en cours...' : 'Modifier l\'hôtel'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/hotels')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditHotel

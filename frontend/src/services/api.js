import axios from 'axios'

// Configuration de base pour axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend Django API
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, on le supprime et on redirige vers login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Services d'authentification
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve()
  },
  getCurrentUser: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },
}

// Services Hotels
export const hotelService = {
  getAllHotels: () => api.get('/hotels/'),
  getHotel: (id) => api.get(`/hotels/${id}/`),
  createHotel: (data) => {
    // Si c'est FormData, on l'envoie comme tel
    if (data instanceof FormData) {
      return api.post('/hotels/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
    }
    // Sinon on l'envoie en JSON
    return api.post('/hotels/', data)
  },
  updateHotel: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/hotels/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.put(`/hotels/${id}/`, data)
  },
  deleteHotel: (id) => api.delete(`/hotels/${id}/`),
}

// Services Rooms
export const roomService = {
  getAllRooms: () => api.get('/rooms/'),
  getRoom: (id) => api.get(`/rooms/${id}/`),
  createRoom: (data) => api.post('/rooms/', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}/`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}/`),
}

// Services Bookings
export const bookingService = {
  getAllBookings: () => api.get('/bookings/'),
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.put(`/bookings/${id}/`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}/`),
}

// Services Users
export const userService = {
  getAllUsers: () => api.get('/users/'),
  getUser: (id) => api.get(`/users/${id}/`),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.put(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
}

// API Root
export const getApiInfo = () => api.get('/')

export default api

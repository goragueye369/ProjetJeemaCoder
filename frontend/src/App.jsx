import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import HotelsList from './pages/HotelsList'
import CreateHotel from './pages/CreateHotel'
import EditHotel from './pages/EditHotel'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Routes publiques - accessibles sans authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes protégées - nécessitent une authentification */}
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/hotels" element={<HotelsList />} />
                        <Route path="/hotels/create" element={<CreateHotel />} />
                        <Route path="/hotels/edit/:id" element={<EditHotel />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

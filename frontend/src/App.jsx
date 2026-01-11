import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import HotelsList from './pages/HotelsList'
import HotelDetails from './pages/HotelDetails'
import CreateHotel from './pages/CreateHotel'
import EditHotel from './pages/EditHotel'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées */}
          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Header />
                  <main className="p-6">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Header />
                  <main className="p-6">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/hotels" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Header />
                  <main className="p-6">
                    <HotelsList />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/hotels/create" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Header />
                  <main className="p-6">
                    <CreateHotel />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/hotels/edit/:id" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Header />
                  <main className="p-6">
                    <EditHotel />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/hotels/:id" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <HotelDetails />
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

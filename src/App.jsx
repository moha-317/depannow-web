import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ClientDashboard from './pages/ClientDashboard'
import DriverDashboard from './pages/DriverDashboard'

// Spinner de chargement
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#1E3A5F] font-semibold">Chargement...</p>
      </div>
    </div>
  )
}

// Route protégée avec gestion des rôles
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirection intelligente selon le rôle
    if (user.role === 'driver') return <Navigate to="/driver-dashboard" replace />
    if (user.role === 'client') return <Navigate to="/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}

// Redirection post-login selon le rôle
function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'driver') return <Navigate to="/driver-dashboard" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Auto-redirect pour /app → selon le rôle */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <RoleRedirect />
              </PrivateRoute>
            }
          />

          {/* Dashboard Client */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['client']}>
                <ClientDashboard />
              </PrivateRoute>
            }
          />

          {/* Dashboard Dépanneur */}
          <Route
            path="/driver-dashboard"
            element={
              <PrivateRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </PrivateRoute>
            }
          />

          {/* Legacy route compat */}
          <Route
            path="/driver"
            element={<Navigate to="/driver-dashboard" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

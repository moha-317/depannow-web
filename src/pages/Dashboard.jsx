import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaBell,
  FaUser,
} from 'react-icons/fa'
import { HiLogout } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'

// Données simulées
const mockRequests = [
  {
    id: '1',
    description: 'Crevaison sur autoroute A7',
    address: 'A7, km 234, direction Lyon',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    offers: 3,
  },
  {
    id: '2',
    description: 'Batterie déchargée, démarrage impossible',
    address: '12 rue de la Paix, Paris 75001',
    status: 'in_progress',
    createdAt: '2024-01-14T14:20:00Z',
    offers: 1,
    driver: 'Mohamed K.',
    price: 65,
  },
  {
    id: '3',
    description: 'Panne moteur',
    address: 'Boulevard Haussmann, Paris 75008',
    status: 'completed',
    createdAt: '2024-01-10T09:00:00Z',
    offers: 4,
    driver: 'Ahmed B.',
    price: 120,
    rating: 5,
  },
]

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: FaClock },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: FaMapMarkerAlt },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: FaCheckCircle },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: FaTimesCircle },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('requests')
  const [showNewRequest, setShowNewRequest] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + content layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-primary text-white">
          <div className="px-6 py-5 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">D</span>
              </div>
              <span className="font-bold text-lg">Dépan<span className="text-accent">Now</span></span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {[
              { id: 'requests', icon: FaMapMarkerAlt, label: 'Mes demandes' },
              { id: 'profile', icon: FaUser, label: 'Mon profil' },
              { id: 'notifications', icon: FaBell, label: 'Notifications' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-4 py-5 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-white/50">Client</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-white/60 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile header */}
          <header className="lg:hidden bg-primary px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">D</span>
              </div>
              <span className="text-white font-bold">Dépan<span className="text-accent">Now</span></span>
            </Link>
            <button onClick={handleLogout} className="text-white/70 hover:text-white">
              <HiLogout className="w-5 h-5" />
            </button>
          </header>

          <div className="p-6 max-w-4xl mx-auto">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white mb-6">
              <h1 className="text-2xl font-black mb-1">
                Bonjour, {user?.name?.split(' ')[0] || 'Conducteur'} ! 👋
              </h1>
              <p className="text-white/70 text-sm">Gérez vos demandes de dépannage depuis votre espace.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setShowNewRequest(true)}
              >
                <FaPlus className="w-4 h-4" />
                Nouvelle demande
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Demandes', value: mockRequests.length, color: 'text-primary' },
                { label: 'En cours', value: mockRequests.filter(r => r.status === 'in_progress').length, color: 'text-blue-600' },
                { label: 'Terminées', value: mockRequests.filter(r => r.status === 'completed').length, color: 'text-green-600' },
                { label: 'Note moy.', value: '4.9 ⭐', color: 'text-yellow-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Requests list */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-primary text-lg">Mes demandes</h2>
                <Button variant="primary" size="sm" onClick={() => setShowNewRequest(true)}>
                  <FaPlus className="w-3.5 h-3.5" />
                  Nouvelle
                </Button>
              </div>

              {mockRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <FaMapMarkerAlt className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune demande pour l'instant</p>
                  <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowNewRequest(true)}>
                    Créer ma première demande
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {mockRequests.map((req) => {
                    const status = statusConfig[req.status]
                    return (
                      <div key={req.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-primary text-sm mb-1 truncate">{req.description}</p>
                            <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                              <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                              {req.address}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                                <status.icon className="w-3 h-3" />
                                {status.label}
                              </span>
                              {req.offers > 0 && (
                                <span className="text-gray-500">{req.offers} offre{req.offers > 1 ? 's' : ''}</span>
                              )}
                              {req.price && (
                                <span className="font-semibold text-accent">{req.price} €</span>
                              )}
                              {req.driver && (
                                <span className="text-gray-500">par {req.driver}</span>
                              )}
                              {req.rating && (
                                <span className="flex items-center gap-0.5 text-yellow-500">
                                  <FaStar className="w-3 h-3" />
                                  {req.rating}/5
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Placeholder notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm text-center">
              🚀 <strong>Sprint 3 à venir</strong> — Carte interactive, négociation en temps réel, paiement intégré
            </div>
          </div>
        </main>
      </div>

      {/* Modal nouvelle demande (placeholder) */}
      {showNewRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowNewRequest(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-primary mb-2">Nouvelle demande</h3>
            <p className="text-gray-500 text-sm mb-4">Cette fonctionnalité sera disponible dans le Sprint 3 avec la carte interactive et la géolocalisation.</p>
            <Button variant="primary" className="w-full" onClick={() => setShowNewRequest(false)}>
              Compris !
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

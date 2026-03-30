import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaEuroSign,
  FaClock,
  FaCheckCircle,
  FaTools,
  FaBell,
  FaUser,
  FaPhone,
} from 'react-icons/fa'
import { HiLogout } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'

// Données simulées — demandes disponibles à proximité
const mockAvailable = [
  {
    id: '101',
    description: 'Crevaison — pneu avant gauche crevé',
    address: 'A7, km 234, Valence — 3.2 km',
    clientName: 'Sophie M.',
    postedAt: '5 min',
    urgency: 'high',
  },
  {
    id: '102',
    description: 'Batterie à plat, besoin d\'un boost',
    address: 'Place Bellecour, Lyon — 1.8 km',
    clientName: 'Karim B.',
    postedAt: '12 min',
    urgency: 'medium',
  },
  {
    id: '103',
    description: 'Clés enfermées dans le véhicule',
    address: 'Rue de la République, Lyon — 4.1 km',
    clientName: 'Marc D.',
    postedAt: '18 min',
    urgency: 'low',
  },
]

const mockMyJobs = [
  {
    id: '201',
    description: 'Remorquage suite panne moteur',
    address: 'Boulevard Haussmann, Paris',
    status: 'completed',
    price: 180,
    date: '2024-01-14',
    client: 'Lucie P.',
    rating: 5,
  },
  {
    id: '202',
    description: 'Démarrage batterie',
    address: 'Gare Part-Dieu, Lyon',
    status: 'completed',
    price: 55,
    date: '2024-01-12',
    client: 'Thomas R.',
    rating: 4,
  },
]

const urgencyConfig = {
  high: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  medium: { label: 'Normal', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  low: { label: 'Faible', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
}

export default function DriverDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('available')
  const [isOnline, setIsOnline] = useState(true)
  const [offerModal, setOfferModal] = useState(null)
  const [offerPrice, setOfferPrice] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              { id: 'available', icon: FaMapMarkerAlt, label: 'Demandes proches' },
              { id: 'jobs', icon: FaCheckCircle, label: 'Mes interventions' },
              { id: 'earnings', icon: FaEuroSign, label: 'Revenus' },
              { id: 'profile', icon: FaUser, label: 'Mon profil' },
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
            {/* Online toggle */}
            <div className="flex items-center justify-between mb-4 p-3 bg-white/10 rounded-xl">
              <span className="text-sm font-medium">Disponible</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isOnline ? 'bg-green-500' : 'bg-white/30'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center">
                <FaTools className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || 'Dépanneur'}</p>
                <p className="text-xs text-white/50">Dépanneur Pro</p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isOnline ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}
              >
                {isOnline ? '● En ligne' : '○ Hors ligne'}
              </button>
              <button onClick={handleLogout} className="text-white/70 hover:text-white">
                <HiLogout className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="p-6 max-w-4xl mx-auto">
            {/* Status banner */}
            <div className={`rounded-2xl p-5 text-white mb-6 ${isOnline ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-gray-500 to-gray-400'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black">
                    {isOnline ? '🟢 Vous êtes en ligne' : '⚫ Vous êtes hors ligne'}
                  </h1>
                  <p className="text-white/80 text-sm mt-0.5">
                    {isOnline ? 'Vous recevez les demandes de dépannage proches de vous.' : 'Activez votre statut pour recevoir des demandes.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Ce mois', value: '1 240 €', color: 'text-accent' },
                { label: 'Interventions', value: mockMyJobs.length, color: 'text-primary' },
                { label: 'Note', value: '4.8 ⭐', color: 'text-yellow-600' },
                { label: 'Taux accept.', value: '94%', color: 'text-green-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Mobile tab switcher */}
            <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
              {[
                { id: 'available', label: 'Disponibles' },
                { id: 'jobs', label: 'Mes jobs' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === t.id ? 'bg-primary text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Available requests */}
            {(activeTab === 'available' || window.innerWidth < 1024) && activeTab === 'available' && (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-primary text-lg">
                    Demandes proches
                    {isOnline && (
                      <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        {mockAvailable.length} nouvelles
                      </span>
                    )}
                  </h2>
                  <FaBell className="w-4 h-4 text-gray-400" />
                </div>

                {!isOnline ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 mb-3">Activez votre statut pour voir les demandes</p>
                    <Button variant="primary" size="sm" onClick={() => setIsOnline(true)}>
                      Passer en ligne
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {mockAvailable.map((req) => {
                      const urg = urgencyConfig[req.urgency]
                      return (
                        <div key={req.id} className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${urg.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                                  {urg.label}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                  <FaClock className="w-3 h-3" />
                                  Il y a {req.postedAt}
                                </span>
                              </div>
                              <p className="font-semibold text-primary text-sm mb-1">{req.description}</p>
                              <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                                <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                                {req.address}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => setOfferModal(req)}
                                >
                                  Faire une offre
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FaPhone className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* My jobs */}
            {activeTab === 'jobs' && (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-primary text-lg">Mes interventions</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockMyJobs.map((job) => (
                    <div key={job.id} className="p-5 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary text-sm truncate">{job.description}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{job.address}</p>
                        <p className="text-gray-400 text-xs mt-1">{new Date(job.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-accent font-bold">{job.price} €</p>
                        <p className="text-xs text-gray-400">{job.client}</p>
                        <p className="text-yellow-500 text-xs">{'⭐'.repeat(job.rating)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Placeholder notice */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-sm text-center">
              🚀 <strong>Sprint 3</strong> — Carte en temps réel, chat client/dépanneur, système de paiement
            </div>
          </div>
        </main>
      </div>

      {/* Offer Modal */}
      {offerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setOfferModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-primary mb-1">Faire une offre</h3>
            <p className="text-gray-500 text-sm mb-4">{offerModal.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre prix (€)</label>
              <div className="relative">
                <FaEuroSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="10"
                  placeholder="ex: 80"
                  value={offerPrice}
                  onChange={e => setOfferPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOfferModal(null)}>
                Annuler
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!offerPrice}
                onClick={() => {
                  // TODO: appel API Sprint 3
                  setOfferModal(null)
                  setOfferPrice('')
                }}
              >
                Envoyer {offerPrice ? `${offerPrice} €` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import {
  FiMapPin, FiClock, FiAlertCircle, FiTruck, FiDollarSign,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiPlusCircle, FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { useGeolocation } from '../hooks/useGeolocation'
import { requestsApi } from '../api/requests.api'
import { offersApi } from '../api/offers.api'
import { driversApi } from '../api/drivers.api'
import MapView from '../components/MapView'
import { useNavigate } from 'react-router-dom'

const PROBLEMS = [
  'Panne de batterie', 'Crevaison', 'Panne sèche', 'Surchauffe moteur',
  'Accident', 'Problème de démarrage', 'Clé perdue / Véhicule verrouillé', 'Autre',
]

function CounterModal({ offer, onSubmit, onClose }) {
  const [price, setPrice] = useState(offer.price || '')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Contre-proposition</h3>
        <p className="text-sm text-gray-500 mb-3">
          Offre actuelle : <span className="font-semibold text-orange-500">{offer.price} €</span>
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-1">Votre contre-offre (€)</label>
        <input
          type="number"
          min="1"
          className="input-field mb-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex : 80"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-outline !border-gray-300 !text-gray-600 hover:!bg-gray-100">
            Annuler
          </button>
          <button
            onClick={() => onSubmit(Number(price))}
            disabled={!price || Number(price) <= 0}
            className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}

function OfferCard({ offer, requestId, onRefresh }) {
  const [counterModal, setCounterModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRespond = async (action, counterPrice) => {
    setLoading(true)
    try {
      await offersApi.respondToOffer(requestId, offer._id || offer.id, {
        action,
        ...(counterPrice ? { counter_price: counterPrice } : {}),
      })
      toast.success(
        action === 'accept' ? '✅ Offre acceptée !' :
        action === 'refuse' ? '❌ Offre refusée' : '🔄 Contre-offre envoyée'
      )
      onRefresh()
    } catch {
      toast.error('Erreur lors de la réponse à l\'offre')
    } finally {
      setLoading(false)
      setCounterModal(false)
    }
  }

  return (
    <>
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            🚛 {offer.driver?.name || 'Dépanneur'}{' '}
            {offer.driver?.rating && (
              <span className="text-yellow-500">★ {offer.driver.rating}</span>
            )}
          </span>
          <span className="text-lg font-bold text-orange-500">{offer.price} €</span>
        </div>
        {offer.message && (
          <p className="text-xs text-gray-500 italic">"{offer.message}"</p>
        )}
        {offer.status === 'pending' && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => handleRespond('accept')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition disabled:opacity-40"
            >
              <FiCheckCircle size={14} /> Accepter
            </button>
            <button
              onClick={() => handleRespond('refuse')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl transition disabled:opacity-40"
            >
              <FiXCircle size={14} /> Refuser
            </button>
            <button
              onClick={() => setCounterModal(true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl transition disabled:opacity-40"
            >
              <FiRefreshCw size={14} /> Contre
            </button>
          </div>
        )}
        {offer.status !== 'pending' && (
          <span className={`text-xs font-semibold mt-1 ${
            offer.status === 'accepted' ? 'text-green-600' :
            offer.status === 'refused' ? 'text-red-500' : 'text-blue-500'
          }`}>
            {offer.status === 'accepted' ? '✅ Acceptée' :
             offer.status === 'refused' ? '❌ Refusée' : `🔄 Statut : ${offer.status}`}
          </span>
        )}
      </div>
      {counterModal && (
        <CounterModal
          offer={offer}
          onSubmit={(cp) => handleRespond('counter', cp)}
          onClose={() => setCounterModal(false)}
        />
      )}
    </>
  )
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { position, loading: geoLoading, getPosition } = useGeolocation()

  // Form state
  const [mode, setMode] = useState('urgent') // 'urgent' | 'scheduled'
  const [form, setForm] = useState({
    address: '',
    brand: '',
    model: '',
    problem: '',
    initial_client_offer: '',
    scheduled_at: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Data state
  const [myRequests, setMyRequests] = useState([])
  const [nearbyDrivers, setNearbyDrivers] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Map state
  const [mapCenter, setMapCenter] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (mode === 'urgent') {
      getPosition()
    }
  }, [mode]) // eslint-disable-line

  useEffect(() => {
    if (position) {
      setMapCenter({ lat: position.lat, lng: position.lng })
      setMapMarkers((prev) => [
        { lat: position.lat, lng: position.lng, type: 'client', popup: 'Votre position' },
        ...prev.filter((m) => m.type === 'driver'),
      ])
    }
  }, [position])

  useEffect(() => {
    if (nearbyDrivers.length > 0) {
      setMapMarkers((prev) => [
        ...prev.filter((m) => m.type === 'client'),
        ...nearbyDrivers.map((d) => ({
          lat: d.location?.lat || d.lat,
          lng: d.location?.lng || d.lng,
          type: 'driver',
          popup: d.name || 'Dépanneur',
        })),
      ])
    }
  }, [nearbyDrivers])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const [reqRes] = await Promise.allSettled([
        requestsApi.getMyRequests(),
      ])
      if (reqRes.status === 'fulfilled') {
        setMyRequests(reqRes.value.data?.requests || reqRes.value.data || [])
      }
    } catch (e) {
      // API not connected yet, use mock data
    } finally {
      setLoadingData(false)
    }
  }

  const loadNearbyDrivers = async () => {
    if (!position) return
    try {
      const res = await driversApi.getNearbyDrivers({ lat: position.lat, lng: position.lng, radius: 10 })
      setNearbyDrivers(res.data?.drivers || res.data || [])
    } catch {
      // silent fail
    }
  }

  const handleField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!position && mode === 'urgent') {
      toast.error('Activez la géolocalisation pour le mode urgence')
      return
    }
    if (!form.problem) {
      toast.error('Sélectionnez le type de problème')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        mode,
        address: mode === 'urgent' ? `${position.lat}, ${position.lng}` : form.address,
        location: position ? { lat: position.lat, lng: position.lng } : undefined,
        vehicle: { brand: form.brand, model: form.model },
        problem: form.problem,
        initial_client_offer: Number(form.initial_client_offer),
        ...(mode === 'scheduled' && { scheduled_at: form.scheduled_at }),
      }
      await requestsApi.createRequest(payload)
      toast.success('🚨 Demande envoyée ! Les dépanneurs sont notifiés.')
      setForm({ address: '', brand: '', model: '', problem: '', initial_client_offer: '', scheduled_at: '' })
      setShowForm(false)
      loadData()
      loadNearbyDrivers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création de la demande')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const statusLabel = (s) => {
    const map = {
      pending: { label: '⏳ En attente', color: 'text-yellow-600 bg-yellow-50' },
      accepted: { label: '✅ Acceptée', color: 'text-green-600 bg-green-50' },
      in_progress: { label: '🚛 En cours', color: 'text-blue-600 bg-blue-50' },
      completed: { label: '✅ Terminée', color: 'text-gray-600 bg-gray-100' },
      cancelled: { label: '❌ Annulée', color: 'text-red-500 bg-red-50' },
    }
    return map[s] || { label: s, color: 'text-gray-500 bg-gray-100' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-primary shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">🔧 DépannOW</h1>
            <p className="text-blue-200 text-sm">Bonjour {user?.firstName || user?.name || 'Client'} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowForm(!showForm) }}
              className="flex items-center gap-2 bg-accent hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              <FiPlusCircle size={16} />
              <span className="hidden sm:inline">Nouvelle demande</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-blue-200 hover:text-white transition p-2"
              title="Déconnexion"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── FORM ── */}
        {showForm && (
          <div className="card">
            <h2 className="text-primary font-bold text-xl mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-accent" /> Nouvelle demande de dépannage
            </h2>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-5 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMode('urgent')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  mode === 'urgent' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiAlertCircle size={15} /> Mode Urgence
              </button>
              <button
                type="button"
                onClick={() => setMode('scheduled')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  mode === 'scheduled' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiClock size={15} /> Mode Programmé
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location */}
              {mode === 'urgent' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📍 Position actuelle
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 input-field bg-gray-50 text-gray-500 text-sm flex items-center">
                      {geoLoading
                        ? '📡 Localisation en cours...'
                        : position
                        ? `✅ ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
                        : '❌ Position non obtenue'}
                    </div>
                    <button
                      type="button"
                      onClick={getPosition}
                      className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition"
                    >
                      {geoLoading ? '...' : '📡 Localiser'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📍 Adresse de départ
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleField}
                      className="input-field"
                      placeholder="Ex : 12 rue de la Paix, Paris"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🗓️ Date et heure
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduled_at"
                      value={form.scheduled_at}
                      onChange={handleField}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Vehicle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">🚗 Marque</label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleField}
                    className="input-field"
                    placeholder="Ex : Renault"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">🚘 Modèle</label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleField}
                    className="input-field"
                    placeholder="Ex : Clio 4"
                    required
                  />
                </div>
              </div>

              {/* Problem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🔧 Type de problème</label>
                <select
                  name="problem"
                  value={form.problem}
                  onChange={handleField}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionner un problème...</option>
                  {PROBLEMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Price offer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  💶 Votre offre initiale (€)
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="initial_client_offer"
                    value={form.initial_client_offer}
                    onChange={handleField}
                    className="input-field pl-9"
                    placeholder="Ex : 80"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiTruck size={18} />
                {submitting ? 'Envoi en cours...' : 'Trouver un dépanneur'}
              </button>
            </form>
          </div>
        )}

        {/* ── MAP ── */}
        <div className="card !p-0 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-primary font-bold text-lg flex items-center gap-2">
              <FiMapPin className="text-accent" /> Carte de proximité
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Rouge = vous · Bleu = dépanneurs disponibles</p>
          </div>
          <MapView
            center={mapCenter || { lat: 48.8566, lng: 2.3522 }}
            markers={mapMarkers}
            height="350px"
          />
          {!position && (
            <div className="px-4 py-3 flex items-center justify-between bg-blue-50 border-t border-blue-100">
              <p className="text-sm text-blue-700">Activez la géoloc pour voir votre position</p>
              <button
                onClick={getPosition}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Activer
              </button>
            </div>
          )}
        </div>

        {/* ── ACTIVE REQUESTS ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-primary font-bold text-xl flex items-center gap-2">
              <FiTruck className="text-accent" /> Mes demandes actives
            </h2>
            <button onClick={loadData} className="text-gray-400 hover:text-primary transition p-1">
              <FiRefreshCw size={18} className={loadingData ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingData ? (
            <div className="card flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myRequests.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <FiTruck size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune demande pour le moment</p>
              <p className="text-sm mt-1">Cliquez sur "Nouvelle demande" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const { label, color } = statusLabel(req.status)
                return (
                  <div key={req._id || req.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">
                          {req.vehicle?.brand} {req.vehicle?.model}
                        </p>
                        <p className="text-sm text-gray-500">{req.problem}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          📍 {req.address || 'Position GPS'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>{label}</span>
                        <span className="text-sm font-bold text-orange-500">{req.initial_client_offer} €</span>
                      </div>
                    </div>

                    {/* Offers */}
                    {req.offers && req.offers.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {req.offers.length} offre(s) reçue(s)
                        </p>
                        <div className="space-y-2">
                          {req.offers.map((offer) => (
                            <OfferCard
                              key={offer._id || offer.id}
                              offer={offer}
                              requestId={req._id || req.id}
                              onRefresh={loadData}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {(!req.offers || req.offers.length === 0) && req.status === 'pending' && (
                      <p className="text-sm text-gray-400 italic mt-2">
                        ⏳ En attente d'offres de dépanneurs...
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

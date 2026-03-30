import axios from './axios'

export const requestsApi = {
  /**
   * Créer une nouvelle demande de dépannage
   */
  create: (data) => axios.post('/requests', data),

  createRequest: (data) => axios.post('/requests', data),

  /**
   * Récupérer toutes les demandes du client connecté
   */
  getMyRequests: () => axios.get('/requests/me'),

  /**
   * Récupérer les demandes disponibles à proximité (pour les dépanneurs)
   * @param {{ lat: number, lng: number, radius?: number }} params
   */
  getNearbyRequests: (params) => axios.get('/requests/nearby', { params }),

  /**
   * Récupérer les demandes disponibles (pour les dépanneurs)
   */
  getAvailable: () => axios.get('/requests/available'),

  /**
   * Récupérer une demande par son ID
   * @param {string} id
   */
  getById: (id) => axios.get(`/requests/${id}`),

  /**
   * Faire une offre sur une demande (dépanneur)
   * @param {string} requestId
   * @param {{ price: number, message?: string }} offer
   */
  makeOffer: (requestId, offer) => axios.post(`/requests/${requestId}/offers`, offer),

  /**
   * Accepter une offre (client)
   * @param {string} requestId
   * @param {string} offerId
   */
  acceptOffer: (requestId, offerId) =>
    axios.patch(`/requests/${requestId}/offers/${offerId}/accept`),

  /**
   * Annuler une demande
   * @param {string} id
   */
  cancel: (id) => axios.patch(`/requests/${id}/cancel`),

  /**
   * Marquer comme terminé
   * @param {string} id
   */
  complete: (id) => axios.patch(`/requests/${id}/complete`),
}

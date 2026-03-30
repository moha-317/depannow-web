import axios from './axios'

export const offersApi = {
  /**
   * Créer une offre sur une demande (dépanneur)
   * @param {string} requestId
   * @param {{ price: number, message?: string }} data
   */
  createOffer: (requestId, data) =>
    axios.post(`/requests/${requestId}/offers`, data),

  /**
   * Répondre à une offre (client) : accepter / refuser / contre-proposer
   * @param {string} requestId
   * @param {string} offerId
   * @param {{ action: 'accept'|'refuse'|'counter', counter_price?: number }} data
   */
  respondToOffer: (requestId, offerId, data) =>
    axios.patch(`/requests/${requestId}/offers/${offerId}`, data),

  /**
   * Récupérer toutes les offres pour une demande
   * @param {string} requestId
   */
  getOffersForRequest: (requestId) =>
    axios.get(`/requests/${requestId}/offers`),
}

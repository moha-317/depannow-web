import axios from './axios'

export const driversApi = {
  /**
   * Récupérer les dépanneurs à proximité
   * @param {{ lat: number, lng: number, radius?: number }} params
   */
  getNearbyDrivers: (params) =>
    axios.get('/drivers/nearby', { params }),

  /**
   * Mettre à jour la position du dépanneur
   * @param {{ lat: number, lng: number }} location
   */
  updateLocation: (location) =>
    axios.patch('/drivers/location', location),

  /**
   * Mettre à jour la disponibilité du dépanneur
   * @param {{ available: boolean }} data
   */
  updateAvailability: (data) =>
    axios.patch('/drivers/availability', data),
}

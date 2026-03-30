import axios from './axios'

export const authApi = {
  /**
   * Connexion utilisateur
   * @param {{ email: string, password: string }} credentials
   */
  login: (credentials) => axios.post('/auth/login', credentials),

  /**
   * Inscription
   * @param {{ name: string, email: string, password: string, role: 'client'|'driver', phone?: string, vehicle?: string }} data
   */
  register: (data) => axios.post('/auth/register', data),

  /**
   * Récupérer le profil courant (nécessite token)
   */
  getProfile: () => axios.get('/auth/me'),

  /**
   * Déconnexion côté serveur (optionnel, si le backend le supporte)
   */
  logout: () => axios.post('/auth/logout'),
}

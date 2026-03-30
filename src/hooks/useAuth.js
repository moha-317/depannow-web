import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook pour accéder au contexte d'authentification.
 * Doit être utilisé à l'intérieur d'un <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}

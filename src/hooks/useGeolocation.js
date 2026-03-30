import { useState, useCallback } from 'react'

/**
 * Hook pour accéder à la géolocalisation du navigateur.
 * Retourne { position, error, loading, getPosition }
 */
export function useGeolocation(options = {}) {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLoading(false)
      },
      (err) => {
        const messages = {
          1: 'Permission de géolocalisation refusée.',
          2: 'Position non disponible.',
          3: 'Délai de géolocalisation dépassé.',
        }
        setError(messages[err.code] || 'Erreur de géolocalisation.')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
      }
    )
  }, [options])

  return { position, error, loading, getPosition }
}

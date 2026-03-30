import { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth.api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('depannow_token'))
  const [loading, setLoading] = useState(true)

  // Charger le profil au démarrage si token présent
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const profile = await authApi.getProfile()
          setUser(profile.data)
        } catch {
          // Token expiré ou invalide
          logout()
        }
      }
      setLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)
    const { token: newToken, user: userData } = response.data
    localStorage.setItem('depannow_token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (data) => {
    const response = await authApi.register(data)
    const { token: newToken, user: userData } = response.data
    localStorage.setItem('depannow_token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('depannow_token')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

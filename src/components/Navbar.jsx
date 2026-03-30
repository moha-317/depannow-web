import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    return user.role === 'driver' ? '/driver' : '/dashboard'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Dépan<span className="text-accent">Now</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#how-it-works" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Comment ça marche
            </Link>
            <Link to="/#advantages" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Avantages
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to={getDashboardLink()}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Mon espace
                </Link>
                <span className="text-white/50">|</span>
                <span className="text-white/70 text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-accent hover:bg-accent-dark text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors shadow-md"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-4 space-y-3">
          <Link
            to="/#how-it-works"
            className="block text-white/80 hover:text-white py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Comment ça marche
          </Link>
          <Link
            to="/#advantages"
            className="block text-white/80 hover:text-white py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Avantages
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="block text-white/80 hover:text-white py-2 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Mon espace
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-300 hover:text-red-200 py-2 text-sm font-medium"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="text-center text-white font-medium text-sm px-4 py-2.5 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-center bg-accent hover:bg-accent-dark text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

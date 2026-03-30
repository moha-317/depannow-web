import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaTools } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const from = location.state?.from?.pathname || null

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide'
    if (!form.password) errs.password = 'Le mot de passe est requis'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const user = await login(form)
      const redirectTo = from || (user.role === 'driver' ? '/driver' : '/dashboard')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Email ou mot de passe incorrect.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-primary px-4 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">
            Dépan<span className="text-accent">Now</span>
          </span>
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTools className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-primary">Connexion</h1>
              <p className="text-gray-500 mt-2">Bon retour ! Entrez vos identifiants.</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                icon={FaEnvelope}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  icon={FaLock}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <div className="mt-1.5 text-right">
                  <a href="#" className="text-sm text-accent hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-2"
              >
                Se connecter
                <HiArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Register link */}
            <p className="text-center text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-accent font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <p className="text-center mt-6">
            <Link to="/" className="text-gray-400 hover:text-primary text-sm transition-colors">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

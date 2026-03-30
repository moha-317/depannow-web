import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaCar, FaUserCircle, FaTools } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()

  const defaultRole = searchParams.get('role') === 'driver' ? 'driver' : 'client'

  const [role, setRole] = useState(defaultRole)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicleType: '',
    licenseNumber: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const r = searchParams.get('role')
    if (r === 'driver') setRole('driver')
  }, [searchParams])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Le nom est requis'
    if (!form.email) errs.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide'
    if (!form.password) errs.password = 'Le mot de passe est requis'
    else if (form.password.length < 6) errs.password = 'Minimum 6 caractères'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas'
    if (role === 'driver') {
      if (!form.phone) errs.phone = 'Le téléphone est requis'
      if (!form.vehicleType) errs.vehicleType = 'Le type de véhicule est requis'
    }
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
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        ...(role === 'driver' && {
          phone: form.phone,
          vehicleType: form.vehicleType,
          licenseNumber: form.licenseNumber,
        }),
        ...(role === 'client' && form.phone && { phone: form.phone }),
      }
      const user = await register(payload)
      navigate(user.role === 'driver' ? '/driver' : '/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Une erreur est survenue. Réessayez.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value })

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
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-primary">Créer un compte</h1>
              <p className="text-gray-500 mt-2">Rejoignez DépanNow en quelques secondes.</p>
            </div>

            {/* Role selector */}
            <div className="flex gap-3 mb-7 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === 'client'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUserCircle className="w-4 h-4" />
                Je suis client
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === 'driver'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaTools className="w-4 h-4" />
                Je suis dépanneur
              </button>
            </div>

            {/* Role description */}
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${role === 'client' ? 'bg-blue-50 text-blue-700' : 'bg-accent/10 text-accent-dark'}`}>
              {role === 'client' ? (
                <span>🚗 En tant que client, vous pourrez signaler vos pannes et recevoir des offres de dépanneurs près de vous.</span>
              ) : (
                <span>🔧 En tant que dépanneur, vous recevrez des demandes de clients et pourrez proposer vos services avec vos prix.</span>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Nom complet */}
              <Input
                label="Nom complet"
                type="text"
                placeholder="Jean Dupont"
                icon={FaUser}
                value={form.name}
                onChange={setField('name')}
                error={errors.name}
                autoComplete="name"
              />

              {/* Email */}
              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                icon={FaEnvelope}
                value={form.email}
                onChange={setField('email')}
                error={errors.email}
                autoComplete="email"
              />

              {/* Téléphone (optionnel client, requis dépanneur) */}
              <Input
                label={`Téléphone ${role === 'driver' ? '' : '(optionnel)'}`}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                icon={FaPhone}
                value={form.phone}
                onChange={setField('phone')}
                error={errors.phone}
                autoComplete="tel"
              />

              {/* Champs spécifiques dépanneur */}
              {role === 'driver' && (
                <>
                  <Input
                    label="Type de véhicule / équipement"
                    type="text"
                    placeholder="ex: Dépanneuse 3,5T, Plateau, etc."
                    icon={FaCar}
                    value={form.vehicleType}
                    onChange={setField('vehicleType')}
                    error={errors.vehicleType}
                  />
                  <Input
                    label="Numéro de licence (optionnel)"
                    type="text"
                    placeholder="Numéro professionnel"
                    icon={FaTools}
                    value={form.licenseNumber}
                    onChange={setField('licenseNumber')}
                  />
                </>
              )}

              {/* Mot de passe */}
              <Input
                label="Mot de passe"
                type="password"
                placeholder="Minimum 6 caractères"
                icon={FaLock}
                value={form.password}
                onChange={setField('password')}
                error={errors.password}
                autoComplete="new-password"
              />

              {/* Confirmer */}
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                icon={FaLock}
                value={form.confirmPassword}
                onChange={setField('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              {/* CGU */}
              <p className="text-xs text-gray-400 text-center pt-2">
                En créant un compte, vous acceptez nos{' '}
                <a href="#" className="text-accent hover:underline">Conditions d'utilisation</a>{' '}
                et notre{' '}
                <a href="#" className="text-accent hover:underline">Politique de confidentialité</a>.
              </p>

              <Button
                type="submit"
                variant={role === 'driver' ? 'secondary' : 'primary'}
                size="lg"
                loading={loading}
                className="w-full"
              >
                {role === 'driver' ? 'Devenir dépanneur' : 'Créer mon compte'}
                <HiArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

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

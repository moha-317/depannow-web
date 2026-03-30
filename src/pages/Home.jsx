import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FaMapMarkerAlt,
  FaHandshake,
  FaTools,
  FaStar,
  FaShieldAlt,
  FaLocationArrow,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen bg-primary flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      {/* Grid decorative */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 pt-32 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-accent/30">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Disponible 24h/24 — 7j/7
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Dépanné en{' '}
            <span className="text-accent relative">
              quelques
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M0 6 Q100 0 200 6" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            {' '}minutes
          </h1>

          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-xl">
            Signalez votre panne, recevez des offres de dépanneurs vérifiés, négociez le prix et repartez sur la route.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 active:scale-95"
            >
              <FaMapMarkerAlt className="w-5 h-5" />
              Je suis en panne
            </Link>
            <Link
              to="/register?role=driver"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white hover:text-primary transition-all duration-200 active:scale-95"
            >
              <FaTools className="w-5 h-5" />
              Je suis dépanneur
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'].map((color, i) => (
                  <div key={i} className={`w-8 h-8 ${color} rounded-full border-2 border-primary`} />
                ))}
              </div>
              <span className="text-white/60 text-sm">+2 400 utilisateurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-4 h-4 text-yellow-400" />
              ))}
              <span className="text-white/60 text-sm ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <span className="text-xs">Défiler</span>
        <div className="w-0.5 h-8 bg-white/20 rounded-full relative overflow-hidden">
          <div className="absolute top-0 w-full h-4 bg-accent/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    icon: FaMapMarkerAlt,
    number: '01',
    title: 'Signalez',
    desc: 'Décrivez votre panne et partagez votre position. Votre demande est diffusée instantanément aux dépanneurs proches.',
    color: 'bg-blue-500',
  },
  {
    icon: FaHandshake,
    number: '02',
    title: 'Négociez',
    desc: 'Recevez plusieurs offres de prix en temps réel. Choisissez le dépanneur qui vous convient, négociez librement.',
    color: 'bg-accent',
  },
  {
    icon: FaCheckCircle,
    number: '03',
    title: 'Dépanné !',
    desc: 'Le dépanneur arrive à votre position. Suivez-le en temps réel et repartez sur la route en toute sérénité.',
    color: 'bg-green-500',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Processus simple</span>
          <h2 className="text-4xl sm:text-5xl font-black text-primary mt-2 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            En 3 étapes, trouvez un dépanneur fiable et au meilleur prix.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-accent to-green-500 z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 select-none">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Advantages ───────────────────────────────────────────────────────────────
const advantages = [
  {
    icon: FaHandshake,
    title: 'Prix négociable',
    desc: 'Pas de tarif fixé à l\'avance. Recevez plusieurs offres et choisissez le meilleur prix.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: FaShieldAlt,
    title: 'Dépanneurs vérifiés',
    desc: 'Chaque dépanneur est validé avec contrôle d\'identité, assurance et avis clients.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: FaLocationArrow,
    title: 'Suivi en temps réel',
    desc: 'Suivez l\'arrivée de votre dépanneur sur la carte en temps réel. Plus d\'attente incertaine.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: FaLock,
    title: 'Paiement sécurisé',
    desc: 'Votre paiement est protégé et libéré uniquement après confirmation du dépannage.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

function Advantages() {
  return (
    <section id="advantages" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Pourquoi nous choisir</span>
          <h2 className="text-4xl sm:text-5xl font-black text-primary mt-2 mb-4">
            Les avantages DépanNow
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 ${adv.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <adv.icon className={`w-7 h-7 ${adv.color}`} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{adv.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Karim B.',
    role: 'Client',
    city: 'Lyon',
    rating: 5,
    text: 'Incroyable ! J\'ai eu une panne sur l\'autoroute A7, j\'ai lancé la demande et en 8 minutes j\'avais 3 offres. J\'ai négocié et eu un super prix. Le dépanneur était là en 20 min !',
    avatar: 'KB',
    avatarColor: 'bg-blue-500',
  },
  {
    name: 'Sophie M.',
    role: 'Cliente',
    city: 'Paris',
    rating: 5,
    text: 'Super application, interface très claire. J\'avais peur d\'être arnaquée mais les avis des dépanneurs sont transparents. Panne réglée rapidement et pour un prix raisonnable.',
    avatar: 'SM',
    avatarColor: 'bg-pink-500',
  },
  {
    name: 'Ahmed T.',
    role: 'Dépanneur professionnel',
    city: 'Marseille',
    rating: 5,
    text: 'En tant que dépanneur, DépanNow m\'a permis de doubler mon chiffre d\'affaires. Je reçois des demandes en continu et le système de négociation est vraiment fair-play.',
    avatar: 'AT',
    avatarColor: 'bg-accent',
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Ils nous font confiance</span>
          <h2 className="text-4xl sm:text-5xl font-black text-primary mt-2 mb-4">
            Témoignages
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FaStar key={j} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${t.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-accent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
          Rejoignez{' '}
          <span className="text-accent">DépanNow</span>
        </h2>
        <p className="text-white/65 text-xl mb-10 max-w-xl mx-auto">
          Que vous soyez en panne ou dépanneur professionnel, DépanNow simplifie tout.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark text-white font-bold text-lg px-9 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-accent/30 active:scale-95"
          >
            Créer un compte gratuit
            <HiArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-3 border-2 border-white/30 text-white font-semibold text-lg px-9 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200 active:scale-95"
          >
            J'ai déjà un compte
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {[
            { icon: FaShieldAlt, label: '100% sécurisé' },
            { icon: FaCheckCircle, label: 'Inscription gratuite' },
            { icon: FaStar, label: 'Noté 4.9/5' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-white/50">
              <badge.icon className="w-4 h-4" />
              <span className="text-sm">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Advantages />
      <Testimonials />
      <CTAFinal />
      <Footer />
    </div>
  )
}

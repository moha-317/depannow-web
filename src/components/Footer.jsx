import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo & tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-black">D</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                Dépan<span className="text-accent">Now</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              La première marketplace de dépannage auto en France. Rapide, transparent, et négociable.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Comment ça marche', to: '/#how-it-works' },
                { label: 'Avantages', to: '/#advantages' },
                { label: 'Témoignages', to: '/#testimonials' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/60 hover:text-accent text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Légal</h4>
            <ul className="space-y-2.5">
              {[
                'Conditions d\'utilisation',
                'Politique de confidentialité',
                'Cookies',
                'Mentions légales',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-accent text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            © {year} DépanNow. Tous droits réservés.
          </p>
          <p className="text-white/40 text-sm">
            Fait avec ❤️ en France
          </p>
        </div>
      </div>
    </footer>
  )
}

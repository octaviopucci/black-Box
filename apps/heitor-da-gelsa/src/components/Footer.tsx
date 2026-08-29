import { Link } from 'react-router-dom'
import { navLinks, siteConfig, socialLinks } from '@/data/site'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-green-deep py-16 text-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-yellow" aria-hidden />
      <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden />

      <div className="section-container relative">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-black tracking-tight">
              {siteConfig.nameLines[0]}
              <span className="mt-1 block text-yellow">{siteConfig.nameLines[1]}</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">{siteConfig.locationLabel}</p>
            <p className="mt-2 text-sm text-white/50">{siteConfig.role}</p>
          </div>

          <div>
            <p className="eyebrow text-yellow">Navegação</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/75 transition-colors hover:text-yellow">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-yellow">Redes</p>
            <ul className="mt-4 space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url.startsWith('http') ? link.url : '#'}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/75 transition-colors hover:text-yellow"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-yellow">Legal</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#" className="text-sm text-white/75 transition-colors hover:text-yellow">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/75 transition-colors hover:text-yellow">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Capão Bonito — São Paulo.
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

const nav = [
  { to: '/imoveis', label: 'Imóveis' },
  { to: '/imoveis?tipo=venda', label: 'Comprar' },
  { to: '/imoveis?tipo=aluguel', label: 'Alugar' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/avaliacao', label: 'Avaliação' },
  { to: '/empresa', label: 'Empresa' },
  { to: '/anunciar', label: 'Anunciar' },
  { to: '/contato', label: 'Contato' },
]

export function Footer() {
  return (
    <footer className="bg-blue-deep text-white">
      <div className="mx-auto grid w-full max-w-shell gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
        <div>
          <img
            src={site.logo}
            alt={site.name}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
            {site.legalName}. Tradição familiar desde {site.since} em Capão Bonito e região.
            Compra, venda, locação e administração com ética e proximidade.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn-primary">
              WhatsApp
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white transition hover:border-gold hover:text-gold"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center border border-white/20 px-4 text-sm text-white/80 transition hover:border-gold hover:text-gold"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <p className="section-label !text-gold">Navegar</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label !text-gold">Escritório</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{site.address.full}</p>
          <p className="mt-3 text-sm text-white/70">{site.hours.weekdays}</p>
          <p className="text-sm text-white/70">{site.hours.saturday}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm text-gold transition hover:text-gold-soft"
          >
            {site.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-shell flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/45 sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.brand}. Todos os direitos reservados.
          </p>
          <p>Capão Bonito · Vale do Ribeira · Sudoeste Paulista</p>
        </div>
      </div>
    </footer>
  )
}

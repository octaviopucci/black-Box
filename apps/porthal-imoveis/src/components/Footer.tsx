import { Link } from 'react-router-dom'
import { site } from '../data/site'

const nav = [
  { href: '/imoveis?tx=sale', label: 'Comprar' },
  { href: '/imoveis?tx=rent', label: 'Alugar' },
  { href: '/#destaques', label: 'Sítios' },
  { href: '/imoveis', label: 'Catálogo' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#financie', label: 'Financie' },
  { href: '/#contato', label: 'Contato' },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label={site.name}>
              <img
                src={site.logo}
                alt={site.name}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              {site.tagline}. Consultoria imobiliária com transparência em Capão Bonito e região.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Navegação
            </p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/70 transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Contato
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                  {site.address}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              {site.phones.map((p) => (
                <li key={p.label}>
                  <a href={p.href} className="hover:text-white">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4 text-sm font-medium">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                Facebook
              </a>
              <a
                href={site.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. CNPJ {site.cnpj}.
          </p>
          <p>Imóvel moeda forte — Capão Bonito/SP</p>
        </div>
      </div>
    </footer>
  )
}

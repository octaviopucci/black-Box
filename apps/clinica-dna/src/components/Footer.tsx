import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper pb-24 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={site.logo} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-display text-3xl font-semibold text-navy">{site.name}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-mute">{site.tagline}</p>
            </div>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mute">{site.description}</p>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-aqua-deep">Navegação</p>
          <ul className="mt-4 space-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-mute transition hover:text-navy">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-aqua-deep">Contato</p>
          <p className="mt-4 text-sm text-mute">{site.address}</p>
          <p className="mt-2 text-sm text-mute">{site.hours.weekdays}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-snow transition hover:bg-abyss"
            >
              WhatsApp
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-navy transition hover:border-aqua"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-line px-5 pt-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </p>
        <p>
          Demo premium · Black Box · CNPJ {site.cnpj}
        </p>
      </div>
    </footer>
  )
}

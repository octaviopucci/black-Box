import { Link } from 'react-router-dom'
import { bookingUrl, careAreas, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-snow">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-wine font-display text-sm font-extrabold text-snow">
              {site.shortName}
            </span>
            <span>
              <span className="block font-display text-xl font-bold">{site.name}</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-snow/40">
                {site.specialty}
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-snow/50">{site.description}</p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-volt">Cuidados</p>
          <ul className="mt-5 space-y-3">
            {careAreas.map((area) => (
              <li key={area.id}>
                <Link
                  to={`/cuidado/${area.id}`}
                  className="text-sm text-snow/65 transition hover:text-volt"
                >
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-volt">Contato</p>
          <ul className="mt-5 space-y-3 text-sm text-snow/65">
            {site.locations.map((l) => (
              <li key={l.id}>{l.city}</li>
            ))}
            <li>{site.crm}</li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-volt"
              >
                <InstagramIcon className="h-4 w-4" />
                {site.instagramHandle}
              </a>
            </li>
            <li>
              <a href={bookingUrl()} target="_blank" rel="noopener noreferrer" className="transition hover:text-volt">
                Agendar via Linktree
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-snow/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-snow/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Conteúdo informativo — não substitui consulta médica quando indicada.</p>
        </div>
      </div>
    </footer>
  )
}

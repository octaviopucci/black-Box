import { Link } from 'react-router-dom'
import { bookingUrl, careAreas, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line bg-void text-snow">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal font-display text-sm font-bold text-void">
              {site.shortName}
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">{site.name}</span>
              <span className="block text-xs uppercase tracking-[0.2em] text-snow/45">
                {site.specialty}
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-snow/55">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-signal">
            Cuidados
          </p>
          <ul className="mt-5 space-y-3">
            {careAreas.map((area) => (
              <li key={area.id}>
                <Link
                  to={`/cuidado/${area.id}`}
                  className="text-sm text-snow/70 transition hover:text-signal"
                >
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-signal">
            Contato
          </p>
          <ul className="mt-5 space-y-3 text-sm text-snow/70">
            <li>{site.address}</li>
            <li>{site.crm}</li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-signal"
              >
                <InstagramIcon className="h-4 w-4" />
                {site.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={bookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-signal"
              >
                Agendar via Linktree
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-snow/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-snow/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Conteúdo informativo — não substitui consulta médica presencial quando indicada.</p>
        </div>
      </div>
    </footer>
  )
}

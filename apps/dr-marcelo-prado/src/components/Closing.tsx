import { Link } from 'react-router-dom'
import { bookingUrl, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Closing() {
  return (
    <footer className="border-t border-paper/10 bg-void pb-28 pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8 md:flex-row md:items-end md:justify-between md:pl-28">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal/12 font-display text-sm font-semibold text-signal ring-1 ring-signal/25">
              {site.shortName}
            </span>
            <div>
              <p className="font-display text-3xl text-paper">{site.name}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-signal/70">
                {site.tagline}
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-mute">{site.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-primary !px-5 !py-2.5">
            Agendar
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost !gap-2 !px-5 !py-2.5"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-paper/10 px-5 pt-6 text-xs text-mute sm:flex-row sm:justify-between sm:px-8 md:pl-28">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.crm}
        </p>
        <p>Conteúdo informativo — não substitui consulta médica.</p>
      </div>
    </footer>
  )
}

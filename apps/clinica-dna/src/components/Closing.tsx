import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Closing() {
  return (
    <footer className="border-t border-paper/10 bg-void pb-28 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 sm:px-8 md:flex-row md:items-end md:justify-between md:pl-28">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt=""
              className="h-11 w-11 rounded-full"
            />
            <div>
              <p className="font-display text-3xl text-paper">{site.name}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-signal/70">{site.tagline}</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">{site.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-void"
          >
            WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-5 py-2.5 text-sm text-paper/80 transition hover:border-signal hover:text-signal"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-paper/10 px-5 pt-6 text-xs text-mute sm:flex-row sm:justify-between sm:px-8 md:pl-28">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Black Box · Capão Bonito/SP</p>
      </div>
    </footer>
  )
}

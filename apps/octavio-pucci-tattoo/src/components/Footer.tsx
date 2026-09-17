import { site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-parchment/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-brand text-2xl tracking-[0.12em]">{site.brand}</p>
          <p className="mt-2 text-xs text-parchment/40">{site.tagline} · {site.city}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.28em] text-parchment/40">
          <a href={whatsappUrl()} className="transition-colors hover:text-parchment">
            WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-parchment"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            Instagram
          </a>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-7xl px-5 text-[10px] text-parchment/25 sm:px-8">
        © {year} {site.name}. Imagens do feed oficial {site.instagramHandle}.
      </p>
    </footer>
  )
}

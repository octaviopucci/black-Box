import { site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="border-t border-ash-line px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <BrandMark className="h-12 w-12" showWordmark />
          <p className="mt-5 max-w-xs text-sm text-ink/50">
            {site.studio} · {site.city}
          </p>
          <p className="mt-2 text-sm text-ink/50">
            {site.address}
            <br />
            {site.landmark}
          </p>
        </div>
        <div className="text-sm text-ink/50">
          <p>
            <a href={whatsappUrl()} className="hover:text-rose-deep">
              WhatsApp {site.phone.label}
            </a>
          </p>
          <p className="mt-2">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-rose-deep">
              {site.instagramHandle}
            </a>
          </p>
          <p className="mt-6 text-xs text-ink/35">
            Pix, cartão e dinheiro · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

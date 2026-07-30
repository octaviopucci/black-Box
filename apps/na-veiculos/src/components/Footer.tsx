import { MessageCircle } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'
import { site, whatsappHref } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-lift px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper-mute">
            {site.description}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper-mute">
              Menu
            </p>
            <ul className="mt-4 space-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-paper/80 transition hover:text-lamp"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper-mute">
              Contato
            </p>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lamp"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {site.whatsapp.label}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lamp"
                >
                  <InstagramIcon className="h-4 w-4" />
                  {site.instagramHandle}
                </a>
              </li>
              <li>
                {site.address.street}, {site.address.city}/{site.address.state}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-line pt-6 text-xs text-paper-mute sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Estoque sujeito a
          disponibilidade.
        </p>
        <p className="font-mono uppercase tracking-[0.16em]">CNPJ {site.cnpj}</p>
      </div>
    </footer>
  )
}

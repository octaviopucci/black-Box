import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-soft px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" />
            <p className="font-display text-2xl font-semibold text-ink">{site.name}</p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
            {site.role} na {site.clinic}. Experiência {site.concept}: presença digital com o mesmo
            cuidado do consultório.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-wine">Navegar</p>
          {site.nav.map((item) => (
            <Link key={item.to} to={item.to} className="text-mute transition hover:text-wine">
              {item.label}
            </Link>
          ))}
          <Link to="/privacidade" className="text-mute transition hover:text-wine">
            Privacidade
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-mute">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-wine">Contato</p>
          <a href={site.phone.href} className="transition hover:text-wine">
            {site.phone.label}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-wine"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
          <a
            href={site.clinicInstagram}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-wine"
          >
            {site.clinicInstagramHandle}
          </a>
          <p className="pt-3 text-xs leading-relaxed text-mute/80">
            {site.legalName}
            <br />
            CNPJ {site.cnpj}
            <br />
            {site.address}
          </p>
        </div>
      </div>
    </footer>
  )
}

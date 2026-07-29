import { site } from '../data/site'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line pb-10 pt-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9" />
            <span className="font-brand text-2xl tracking-[0.14em]">
              OCTÁVIO PUCCI
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-ash">
            {site.mantra} · {site.tagline} · {site.city}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-ash">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-gold"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
          <a href={site.phone.href} className="transition hover:text-gold" data-cursor>
            {site.phone.label}
          </a>
          <a href="#topo" className="transition hover:text-gold" data-cursor>
            Voltar ao topo
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-5 text-xs text-ash/70 sm:px-8">
        © {new Date().getFullYear()} {site.fullName}. Todos os direitos
        reservados. Fotos do Instagram oficial.
      </p>
    </footer>
  )
}

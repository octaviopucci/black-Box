import { site } from '../data/site'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-ink/8 pb-10 pt-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-8" />
            <span className="font-display text-2xl font-semibold tracking-[0.18em]">HARMONIE</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-mute">{site.tagline} · {site.city}</p>
          <p className="mt-2 text-xs text-mute/80">
            {site.legalName} · CNPJ {site.cnpj}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-mute">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
          <a href={site.phone.href} className="hover:text-ink">
            {site.phone.label}
          </a>
          <a href="#topo" className="hover:text-ink">
            Voltar ao topo
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-5 text-xs text-mute/70 sm:px-8">
        © {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.
      </p>
    </footer>
  )
}

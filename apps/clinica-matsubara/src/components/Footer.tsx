import { site } from '../data/site'
import { LogoImage } from './LogoImage'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cream pb-10 pt-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <LogoImage className="h-9 w-9" />
            <span className="font-display text-2xl font-semibold tracking-tight">Matsubara</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-mute">
            {site.tagline} · {site.city}
          </p>
          <p className="mt-2 text-xs text-mute/80">
            {site.legalName} · CNPJ {site.cnpj}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-mute">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-wine"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
          <a href={site.phone.href} className="hover:text-wine">
            {site.phone.label}
          </a>
          <a href="#topo" className="hover:text-wine">
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

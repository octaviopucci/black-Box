import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">Porthal Imóveis</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
            {site.legalName}
            <br />
            CNPJ {site.cnpj}
          </p>
        </div>
        <div className="text-sm text-white/50">
          <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
          <a
            href={site.originalSite}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-white/70 transition hover:text-white"
          >
            Site oficial
          </a>
        </div>
      </div>
    </footer>
  )
}

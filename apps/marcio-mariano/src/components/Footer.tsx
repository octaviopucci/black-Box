import { site, whatsappUrl } from '../data/site'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img
            src={site.logo}
            alt={site.name}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {site.legalName}. {site.description}
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            WhatsApp
          </a>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">Navegar</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a href="#imoveis" className="hover:text-white">
                Imóveis
              </a>
            </li>
            <li>
              <a href="#servicos" className="hover:text-white">
                Serviços
              </a>
            </li>
            <li>
              <a href="#legado" className="hover:text-white">
                Legado
              </a>
            </li>
            <li>
              <a href="#contato" className="hover:text-white">
                Contato
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">Escritório</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{site.address}</p>
          <p className="mt-3 text-sm text-white/70">{site.hours.weekdays}</p>
          <p className="text-sm text-white/70">{site.hours.saturday}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/45 sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>
            Demo premium Black Box · baseado em{' '}
            <a href={site.originalSite} className="underline-offset-2 hover:text-white hover:underline">
              marciomariano.com.br
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

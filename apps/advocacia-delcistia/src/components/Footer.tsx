import { site, navLinks } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-ink py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.28em] text-paper-mute">
            Advocacia
          </p>
          <p className="font-script text-3xl text-paper">Del Cistia</p>
          <p className="mt-2 max-w-sm font-sans text-xs font-light leading-relaxed text-paper-mute">
            {site.legalName} · Especializada em direito criminal · Sorocaba/SP
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Rodapé">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-xs uppercase tracking-[0.14em] text-paper-mute transition hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-line px-5 pt-6 md:px-8">
        <p className="font-sans text-[0.65rem] text-paper-mute/70">
          © {year} {site.legalName}. Conteúdo informativo — não constitui consultoria jurídica
          individualizada.
        </p>
      </div>
    </footer>
  )
}

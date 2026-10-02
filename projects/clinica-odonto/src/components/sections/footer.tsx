import { site, whatsappUrl } from "@/data/site"
import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="agendar" className="bg-[hsl(var(--ink))] text-[hsl(var(--paper))]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div>
            <p className="font-display text-3xl md:text-4xl">{site.name}</p>
            <p className="mt-4 max-w-md text-[hsl(var(--paper)/0.7)]">
              {site.description}
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[hsl(var(--accent))] px-8 py-4 text-sm font-semibold text-[hsl(var(--paper))] transition hover:bg-[hsl(var(--accent-deep))]"
            >
              {site.whatsapp.label}
            </a>
          </div>

          <div className="space-y-6 text-sm text-[hsl(var(--paper)/0.65)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--accent-light))]">
                Contato
              </p>
              <a
                href={site.phone.href}
                className="mt-2 block text-[hsl(var(--paper))] hover:underline"
              >
                {site.phone.label}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--accent-light))]">
                Endereço
              </p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block hover:text-[hsl(var(--paper))]"
              >
                {site.address}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--accent-light))]">
                Horário
              </p>
              <p className="mt-2">{site.hours}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[hsl(var(--paper)/0.1)] pt-8 text-xs text-[hsl(var(--paper)/0.45)] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.fullName}. Todos os direitos reservados.
          </p>
          <nav className="flex gap-6">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[hsl(var(--paper)/0.7)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

import { site, mapsUrl, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export function Contact() {
  const fullAddress = `${site.address.street} — ${site.address.district}, ${site.address.city} - ${site.address.state}`

  return (
    <section id="contato" className="relative bg-ink py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_100%,rgba(156,196,212,0.12),transparent)]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-crystal">
              Contato
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-paper">
              Agende sua avaliação em Caruaru.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-paper/70">
              Atendimento com horário marcado. Rua calma, estacionamento próximo — conforme avaliações
              de pacientes no Google.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                  Endereço
                </p>
                <p className="mt-2 text-paper">{fullAddress}</p>
                <p className="text-sm text-paper/60">CEP {site.address.zip}</p>
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-crystal-soft underline-offset-4 hover:underline"
                >
                  Abrir no mapa
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                  WhatsApp
                </p>
                <a
                  href={whatsappUrl()}
                  className="mt-2 block text-xl text-paper transition-colors hover:text-crystal-soft"
                >
                  {site.phone}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                  Instagram
                </p>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-paper transition-colors hover:text-crystal-soft"
                >
                  <InstagramIcon className="h-5 w-5" />
                  @{site.handle}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-end">
              <a
                href={whatsappUrl('Olá! Vi o site e gostaria de agendar uma avaliação.')}
                className="cta-primary w-full text-center sm:w-auto"
              >
                Chamar no WhatsApp
              </a>
              <p className="mt-6 text-xs leading-relaxed text-paper/40">
                Endereço e telefone verificados em fontes públicas (DentMap, iDoutor). CRO do Dr.
                Erton: 16334-PE.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-lg text-ink">{site.name}</p>
        <p className="text-sm text-ink-mute">
          {site.tagline} · {site.city}
        </p>
      </div>
    </footer>
  )
}

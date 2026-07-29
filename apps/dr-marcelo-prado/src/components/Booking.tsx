import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { bookingUrl, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal, SectionEyebrow } from './Reveal'

export function Booking() {
  return (
    <section id="agendar" className="relative overflow-hidden bg-ink py-28 text-snow sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(26,95,98,0.28), transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(196,181,160,0.1), transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionEyebrow light>Agendar</SectionEyebrow>
              <h2 className="display-title text-[clamp(2.4rem,5.5vw,3.8rem)]">
                Pronto para calibrar o seu corpo?
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-snow/55">
                Agende pelo Linktree ou Instagram. Informe Capão Bonito, Itapeva ou on-line — e o
                que te trouxe até aqui.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={bookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-aqua"
                >
                  Abrir Linktree
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-ghost-light"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Mensagem no Instagram
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="border-t border-snow/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-aqua-light">
                Locais
              </h3>
              <ul className="mt-6 space-y-7">
                {site.locations.map((loc) => (
                  <li key={loc.id}>
                    <p className="font-display text-lg font-bold leading-snug">{loc.city}</p>
                    <p className="mt-1.5 text-sm text-snow/50">{loc.address}</p>
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-champagne transition hover:text-aqua-light"
                    >
                      Mapa
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-snow/10 pt-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-snow/35">Registro</p>
                <p className="mt-1 text-sm text-snow/70">{site.crm}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

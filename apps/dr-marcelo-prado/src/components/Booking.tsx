import { ArrowUpRight, MapPin, ExternalLink } from 'lucide-react'
import { bookingUrl, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal, SectionEyebrow } from './Reveal'

export function Booking() {
  return (
    <section id="agendar" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2.25rem] bg-ink text-snow shadow-lift">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <Reveal>
                <SectionEyebrow light>Agendar</SectionEyebrow>
                <h2 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight text-balance">
                  Pronto para calibrar o seu corpo?
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-snow/55">
                  Agende pelo Linktree ou Instagram. Informe Capão Bonito, Itapeva ou on-line — e o
                  que te trouxe até aqui.
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={bookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3.5 text-sm font-bold text-snow transition hover:bg-wine-soft"
                  >
                    Abrir Linktree
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-snow/20 px-5 py-3.5 text-sm font-semibold text-snow/90 transition hover:border-volt/50 hover:text-volt"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Mensagem no Instagram
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="border-t border-snow/10 bg-ink-soft/80 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Reveal delay={0.15}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-volt">
                  Locais
                </h3>
                <ul className="mt-5 space-y-5">
                  {site.locations.map((loc) => (
                    <li key={loc.id}>
                      <p className="flex items-start gap-3 font-display text-lg font-bold leading-snug">
                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-leaf-soft" aria-hidden />
                        {loc.city}
                      </p>
                      <p className="mt-1 pl-7 text-sm text-snow/50">{loc.address}</p>
                      <a
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 pl-7 text-sm font-semibold text-volt transition hover:text-volt-soft"
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
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

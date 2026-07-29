import { ArrowUpRight, MapPin, ExternalLink } from 'lucide-react'
import { bookingUrl, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal, SectionEyebrow } from './Reveal'

export function Booking() {
  return (
    <section id="agendar" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2.25rem] bg-void text-snow shadow-lift">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <Reveal>
                <SectionEyebrow light>Agendar</SectionEyebrow>
                <h2 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-balance">
                  Pronto para ler os sinais do seu corpo?
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-snow/60">
                  Agende pelo Linktree ou Instagram. Informe se prefere presencial em Itapeva ou
                  consulta on-line — e descreva, em poucas palavras, o que te trouxe até aqui.
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={bookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-void transition hover:bg-signal-soft"
                  >
                    Abrir Linktree
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-snow/20 px-5 py-3.5 text-sm font-medium text-snow/90 transition hover:border-signal/50 hover:text-signal"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Mensagem no Instagram
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="border-t border-snow/10 bg-void-soft/80 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Reveal delay={0.15}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-signal">
                  Consultório
                </h3>
                <p className="mt-4 flex items-start gap-3 font-display text-xl font-semibold leading-snug">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-celadon" aria-hidden />
                  {site.address}
                </p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-celadon transition hover:text-signal"
                >
                  Ver no mapa
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <div className="mt-10 space-y-4 border-t border-snow/10 pt-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-snow/40">
                      Modalidades
                    </p>
                    <p className="mt-1 text-sm text-snow/75">Presencial · On-line</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-snow/40">Registro</p>
                    <p className="mt-1 text-sm text-snow/75">{site.crm}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

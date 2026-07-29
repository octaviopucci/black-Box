import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { careAreas } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function CareAreas() {
  return (
    <section id="cuidados" className="bg-ink py-28 text-snow sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionEyebrow light>Cuidados</SectionEyebrow>
            <h2 className="display-title max-w-xl text-[clamp(2.3rem,5.2vw,3.6rem)]">
              Cinco eixos da modulação aplicada.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-snow/50 sm:text-base">
              Conteúdo nascido do consultório e do Instagram — testosterona, menopausa, corpo,
              ossos e implante, com a mesma linguagem humana.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16">
        {careAreas.map((area, i) => (
          <Reveal key={area.id} delay={0.03 * i}>
            <Link
              to={`/cuidado/${area.id}`}
              data-cursor="hover"
              className="group relative grid min-h-[200px] items-stretch overflow-hidden border-t border-snow/10 last:border-b lg:min-h-[220px] lg:grid-cols-[220px_1fr_1.1fr_auto]"
            >
              <div className="relative hidden overflow-hidden lg:block">
                <img
                  src={area.image}
                  alt=""
                  className="h-full w-full scale-105 object-cover opacity-70 transition duration-700 ease-silk group-hover:scale-100 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
              </div>

              <div className="relative z-10 flex items-center gap-5 px-5 py-9 sm:px-8 lg:px-10">
                <span className="font-display text-2xl font-semibold text-aqua-light/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-fog/40">
                    {area.short}
                  </p>
                  <h3 className="mt-1 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-tight transition group-hover:text-aqua-light">
                    {area.title}
                  </h3>
                </div>
              </div>

              <p className="relative z-10 hidden max-w-md self-center py-10 pr-6 text-sm leading-relaxed text-snow/50 lg:block">
                {area.description}
              </p>

              <div className="relative z-10 flex items-center justify-between gap-4 px-5 pb-9 sm:px-8 lg:justify-end lg:px-10 lg:py-10">
                <div className="flex flex-wrap gap-x-4 gap-y-1 lg:hidden">
                  {area.signals.slice(0, 2).map((s) => (
                    <span key={s} className="text-[11px] uppercase tracking-[0.2em] text-snow/45">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-aqua-light">
                  Abrir
                  <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>

              {/* Immersive hover wash — full row, not a card */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(26,95,98,0.18) 0%, transparent 55%)',
                }}
              />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

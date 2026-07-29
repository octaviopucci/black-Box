import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { careAreas } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function CareAreas() {
  return (
    <section id="cuidados" className="bg-ink py-24 text-snow sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionEyebrow light>Cuidados</SectionEyebrow>
            <h2 className="max-w-xl font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-balance">
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

      <div className="mt-14 space-y-4 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {careAreas.map((area, i) => (
            <Reveal key={area.id} delay={0.04 * i}>
              <Link
                to={`/cuidado/${area.id}`}
                className="group grid items-stretch gap-0 overflow-hidden border-t border-snow/10 last:border-b lg:grid-cols-[140px_1.1fr_1fr_auto]"
              >
                <div className="relative hidden aspect-[4/5] overflow-hidden lg:block lg:aspect-auto lg:min-h-[160px]">
                  <img
                    src={area.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-ink/25" />
                </div>
                <div className="flex items-center gap-4 py-7 pr-4 lg:py-8">
                  <span className="font-display text-2xl font-semibold text-aqua-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-fog/45">
                      {area.short}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      {area.title}
                    </h3>
                  </div>
                </div>
                <p className="hidden max-w-md self-center py-8 text-sm leading-relaxed text-snow/50 lg:block">
                  {area.description}
                </p>
                <div className="flex items-center justify-between gap-4 pb-7 lg:justify-end lg:py-8">
                  <div className="flex flex-wrap gap-2 lg:hidden">
                    {area.signals.slice(0, 2).map((s) => (
                      <span key={s} className="rounded-full border border-snow/15 px-2.5 py-1 text-[11px] text-snow/55">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-aqua-light">
                    Abrir
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

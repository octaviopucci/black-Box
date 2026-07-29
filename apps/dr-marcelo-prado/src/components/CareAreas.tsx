import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { careAreas } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function CareAreas() {
  return (
    <section id="cuidados" className="bg-void py-24 text-snow sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionEyebrow light>Cuidados</SectionEyebrow>
            <h2 className="max-w-xl font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-balance">
              Quatro eixos. Uma cascata de atenção.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-snow/55 sm:text-base">
              Cada eixo é um ponto de entrada — o cuidado conecta tireoide, metabolismo, peso e
              hormônios em um único plano vivo.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-14 overflow-x-auto pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex w-max max-w-none gap-5 px-5 sm:px-8 lg:mx-auto lg:max-w-7xl lg:grid lg:w-auto lg:grid-cols-2 lg:gap-6 xl:grid-cols-4">
          {careAreas.map((area, i) => (
            <Reveal key={area.id} delay={0.06 * i} className="w-[78vw] max-w-sm shrink-0 lg:w-auto lg:max-w-none">
              <Link
                to={`/cuidado/${area.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-void-soft ring-1 ring-snow/10 transition hover:ring-signal/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={area.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-void/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-signal backdrop-blur-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-celadon">
                    {area.short}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-snow/55">
                    {area.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {area.signals.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-snow/10 px-2.5 py-1 text-[11px] text-snow/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-signal">
                    Ver cuidado
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

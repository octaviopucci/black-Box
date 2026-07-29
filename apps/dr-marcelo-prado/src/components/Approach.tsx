import { Reveal, SectionEyebrow } from './Reveal'
import { site } from '../data/site'

export function Approach() {
  return (
    <section id="modulacao" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-wine/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionEyebrow>Modulação</SectionEyebrow>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-ink text-balance">
                Hormônios não se adivinham.
                <span className="mt-2 block text-wine">Eles se calibram.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                Emagrecimento e modulação hormonal com método: do exame ao plano, da energia à
                autoestima — sem protocolo genérico, sem promessa vazia.
              </p>
            </Reveal>

            <div className="mt-12">
              {site.principles.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <article className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7 last:border-b">
                    <span className="font-display text-3xl font-extrabold text-wine/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-mute sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.12} className="relative">
            <div className="sticky top-28 overflow-hidden rounded-[2rem] bg-ink p-8 text-snow shadow-lift sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-wine/40 blur-3xl" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-volt">
                Promessa clínica
              </p>
              <blockquote className="relative mt-8 font-display text-[clamp(1.45rem,3vw,1.95rem)] font-semibold leading-snug tracking-tight text-balance">
                “{site.promise}”
              </blockquote>
              <p className="mt-6 text-sm leading-relaxed text-snow/55">{site.mission}</p>
              <div className="mt-10 flex items-center gap-4 border-t border-snow/10 pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine font-display text-sm font-extrabold">
                  {site.shortName}
                </div>
                <div>
                  <p className="font-bold text-snow">{site.name}</p>
                  <p className="text-sm text-snow/50">{site.crm}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

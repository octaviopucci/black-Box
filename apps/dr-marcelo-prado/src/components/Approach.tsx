import { Reveal, SectionEyebrow } from './Reveal'
import { site } from '../data/site'

export function Approach() {
  return (
    <section id="modulacao" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-aqua/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-champagne/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div>
            <Reveal>
              <SectionEyebrow>Modulação</SectionEyebrow>
              <h2 className="display-title text-[clamp(2.3rem,5.2vw,3.7rem)] text-ink">
                Hormônios não se adivinham.
                <span className="mt-2 block text-aqua">Eles se calibram.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                Emagrecimento e modulação hormonal com método: do exame ao plano, da energia à
                autoestima — sem protocolo genérico, sem promessa vazia.
              </p>
            </Reveal>

            <div className="mt-14">
              {site.principles.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <article className="grid grid-cols-[auto_1fr] gap-6 border-t border-line py-8 last:border-b">
                    <span className="font-display text-3xl font-semibold text-aqua/55">
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

          <Reveal delay={0.12} className="relative lg:pt-10">
            <div className="sticky top-28 border-l-2 border-aqua pl-8 sm:pl-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-aqua">
                Promessa clínica
              </p>
              <blockquote className="mt-6 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-snug tracking-tight text-ink text-balance">
                “{site.promise}”
              </blockquote>
              <p className="mt-6 text-sm leading-relaxed text-mute">{site.mission}</p>
              <div className="mt-10 flex items-center gap-4 border-t border-line pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua font-display text-sm font-semibold text-snow">
                  {site.shortName}
                </div>
                <div>
                  <p className="font-bold text-ink">{site.name}</p>
                  <p className="text-sm text-mute">{site.crm}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

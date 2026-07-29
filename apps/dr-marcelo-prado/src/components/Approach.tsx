import { Reveal, SectionEyebrow } from './Reveal'
import { site } from '../data/site'

export function Approach() {
  return (
    <section id="abordagem" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionEyebrow>Abordagem</SectionEyebrow>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-void text-balance">
                O corpo fala em sinais.
                <span className="mt-2 block italic text-celadon-deep">Nós lemos a cascata.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                Hormônios não agem isolados — eles se propagam. A endocrinologia aplicada observa
                essa cascata inteira: do exame ao sono, do peso à energia, da dúvida à conduta.
              </p>
            </Reveal>

            <div className="mt-12 space-y-0">
              {site.principles.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <article className="group grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7 last:border-b">
                    <span className="font-display text-3xl font-semibold text-signal-deep/80 transition group-hover:text-signal-deep">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-void">
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

          <Reveal delay={0.15} className="relative">
            <div className="sticky top-28 overflow-hidden rounded-[2rem] bg-void p-8 text-snow shadow-lift sm:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-signal/20 blur-2xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">
                Missão clínica
              </p>
              <blockquote className="relative mt-8 font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-snug tracking-tight text-balance">
                “{site.mission}”
              </blockquote>
              <div className="mt-12 flex items-center gap-4 border-t border-snow/10 pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal font-display text-sm font-bold text-void">
                  {site.shortName}
                </div>
                <div>
                  <p className="font-semibold text-snow">{site.name}</p>
                  <p className="text-sm text-snow/55">{site.crm}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

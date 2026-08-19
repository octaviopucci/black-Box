import { site } from '@/data/site'
import { Reveal } from './Reveal'

export function Care() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Cuidados</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-ink">
            Estética facial e corporal — duas frentes, um mesmo cuidado com sua beleza e saúde.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-ink/10 md:grid-cols-2">
          {site.careAreas.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.1}>
              <article className="flex min-h-[280px] flex-col justify-between bg-paper px-8 py-10 md:min-h-[340px] md:px-10 md:py-12">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">
                    0{index + 1}
                  </span>
                  <h3 className="mt-6 font-display text-4xl leading-none tracking-[-0.02em] text-ink md:text-5xl">
                    {area.title}
                  </h3>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-ink-mute">{area.note}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-mute">
            Lista detalhada de procedimentos não foi encontrada em fontes oficiais públicas durante a
            extração. Para confirmar protocolos disponíveis, fale conosco pelo WhatsApp.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

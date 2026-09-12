import { practiceAreas } from '@/data/site'
import { Reveal } from './Reveal'

export function PracticeAreas() {
  return (
    <section id="atuacao" className="relative bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-lift to-transparent" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-bronze">
            Atuação
          </p>
          <h2 className="mt-4 font-brand text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.02] text-paper">
            Assuntos que exigem defesa técnica imediata
          </h2>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-paper-mute">
            Especialização em direito penal e processual penal — da investigação ao júri, com
            orientação clara em cada fase do procedimento.
          </p>
        </Reveal>

        <div className="mt-16 space-y-0 divide-y divide-line border-y border-line">
          {practiceAreas.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.06}>
              <article className="group grid gap-8 py-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 md:py-14">
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
                    <img
                      src={area.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 ease-chamber group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-60" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <span className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.24em] text-bronze/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-brand text-2xl font-medium text-paper md:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 max-w-lg font-sans text-base font-light leading-relaxed text-paper-mute">
                    {area.summary}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

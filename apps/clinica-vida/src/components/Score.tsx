import { asset, specialties } from '../data/site'
import { Reveal } from './Reveal'

export function Score() {
  return (
    <section id="especialidades" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-vida-soft">
            Especialidades
          </p>
          <h2 className="display-title max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)]">
            Um teto. Vários caminhos. Um mesmo cuidado.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-24 sm:space-y-32">
          {specialties.map((area, i) => (
            <Reveal key={area.id} delay={0.06 * i}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden lg:[direction:ltr]">
                  <img
                    src={asset(area.image)}
                    alt={area.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                </div>

                <div className="lg:[direction:ltr]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-vida-soft">
                    {area.accent}
                  </p>
                  <h3 className="display-title mt-3 text-[clamp(2rem,4vw,3rem)]">{area.title}</h3>
                  <p className="mt-3 font-display text-lg italic text-paper/75">{area.line}</p>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/55">{area.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

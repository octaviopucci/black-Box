import { site } from '@/data/site'
import { Reveal } from './Reveal'

export function Care() {
  return (
    <section id="procedimentos" className="px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Procedimentos</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-ink">
            O que a Clínica Mussi publica no Instagram.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-16">
          {site.procedures.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <article
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[4/5] w-full object-cover transition duration-700 ease-tactile hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] text-ink md:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-6 text-lg leading-relaxed text-ink-soft">{item.lead}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-mute">{item.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

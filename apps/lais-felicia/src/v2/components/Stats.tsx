import { v2Stats } from '../data/site'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'

export function Stats() {
  return (
    <section className="section-pad">
      <Reveal>
        <SectionIntro eyebrow="Autoridade e resultado" title="Números que comprovam o método" />
      </Reveal>

      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {v2Stats.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.06}>
            <article className="h-full rounded-xl border border-gold/20 bg-surface-lift/80 px-5 py-8 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold/40">
              <p className="font-display text-4xl font-bold text-gold-deep">{item.value}</p>
              <p className="mt-3 text-sm text-ink-soft">{item.label}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

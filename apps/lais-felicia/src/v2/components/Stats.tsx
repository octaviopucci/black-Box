import { stats } from '../../data/site'
import { Reveal } from './Reveal'

export function Stats() {
  return (
    <section className="section-pad">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Autoridade e resultado</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">Números que comprovam o método</h2>
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.06}>
            <article className="h-full rounded-2xl border border-gold/25 bg-surface-lift px-5 py-8 text-center transition duration-300 hover:-translate-y-1 hover:border-gold/50">
              <p className="font-display text-4xl font-bold text-gold-deep">{item.value}</p>
              <p className="mt-3 text-sm text-ink-soft">{item.label}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

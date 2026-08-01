import { Reveal } from './Reveal'
import { steps } from '../data/site'

export function Steps() {
  return (
    <section id="reservar" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Como reservar</p>
          <h2 className="display-title mt-4 max-w-xl text-3xl sm:text-5xl">
            Três passos até a festa.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <li>
                <span className="font-brand text-5xl font-bold text-sun/90">{s.step}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-paper">{s.title}</h3>
                <p className="mt-3 text-paper/65">{s.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

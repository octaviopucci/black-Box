import { Reveal } from './Reveal'
import { steps } from '../data/site'

export function HowItWorks() {
  return (
    <section id="como" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Como funciona</p>
          <h2 className="display-title mt-4 max-w-xl text-4xl sm:text-5xl">
            Do brief à montagem, sem complicação.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <li>
                <span className="font-brand text-5xl font-extrabold text-sun/90">{s.step}</span>
                <h3 className="mt-4 font-brand text-2xl font-bold text-paper">{s.title}</h3>
                <p className="mt-3 text-paper/65">{s.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { Reveal } from './Reveal'
import { moments } from '../data/site'

export function Moments() {
  return (
    <section id="momentos" className="relative overflow-hidden border-y border-line px-5 py-24 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 flex animate-drift gap-10 whitespace-nowrap py-6 opacity-[0.07]"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <p key={i} className="font-brand text-6xl font-extrabold tracking-tight sm:text-7xl">
            ANIVERSÁRIO · BATIZADO · CASAMENTO · CORPORATIVO · FORMATURA ·&nbsp;
          </p>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Momentos</p>
          <h2 className="display-title mt-4 max-w-xl text-4xl sm:text-5xl">
            Para cada celebração, a estrutura certa.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {moments.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <div className="border-t border-sun/40 pt-6">
                <h3 className="font-brand text-2xl font-bold text-paper">{m.title}</h3>
                <p className="mt-3 text-paper/65">{m.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

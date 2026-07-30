import { journey, whispers } from '../data/site'
import { Reveal } from './Reveal'

export function Whispers() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine/40" />
            O que ecoa
          </p>
          <h2 className="display-title mt-4 max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)]">
            Palavras que carregam a marca.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {whispers.map((w, i) => (
            <Reveal key={w.who + w.role} delay={0.08 * i}>
              <blockquote className="flex h-full flex-col justify-between rounded-[1.75rem] bg-wine p-7 text-cream">
                <p className="font-display text-xl leading-snug sm:text-2xl">“{w.text}”</p>
                <footer className="mt-8 border-t border-cream/15 pt-5">
                  <p className="text-sm font-semibold">{w.who}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-rose-soft">{w.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/10 pt-14 md:grid-cols-3">
          {journey.map((step, i) => (
            <Reveal key={step.step} delay={0.06 * i}>
              <p className="font-script text-5xl text-rose">{step.step}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

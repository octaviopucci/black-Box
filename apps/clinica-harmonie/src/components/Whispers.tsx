import { whispers } from '../data/site'
import { Reveal } from './Reveal'

export function Whispers() {
  return (
    <section className="relative overflow-hidden bg-fern py-24 text-porcelain sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(196,165,116,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(247,244,239,0.08), transparent 35%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">
            Ecos
          </p>
          <h2 className="display-title max-w-2xl text-[clamp(2.2rem,4.5vw,3.4rem)]">
            O que permanece depois do cuidado.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {whispers.map((w, i) => (
            <Reveal key={w.text} delay={0.1 * i}>
              <blockquote className="flex h-full flex-col border-t border-porcelain/20 pt-6">
                <p className="font-display text-2xl italic leading-snug text-porcelain/90">
                  “{w.text}”
                </p>
                <footer className="mt-auto pt-8">
                  <p className="text-sm font-semibold text-gold-soft">{w.who}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-porcelain/45">{w.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

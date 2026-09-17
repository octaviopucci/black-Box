import { philosophy } from '../data/site'
import { Reveal } from './Reveal'

export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={philosophy.image}
              alt="Sorriso natural — odontologia estética Lira Odonto"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-crystal/10" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-crystal">
            Filosofia
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.08] text-paper">
            {philosophy.title}
          </h2>
          <div className="mt-8 space-y-5">
            {philosophy.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-paper/75">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-10 border-l-2 border-crystal/40 pl-5 font-display text-lg italic text-crystal-soft">
            {philosophy.clinicNote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

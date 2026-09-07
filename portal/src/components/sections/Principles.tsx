import { principles } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Principles() {
  return (
    <section className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader title="Como a Black Box pensa" eyebrow="Diferencial" />
        </Reveal>

        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2">
          {principles.map((item, i) => (
            <Reveal key={item.number} delay={0.05 * i}>
              <article className="h-full bg-ink p-7 sm:p-9">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  {item.number}
                </p>
                <h3 className="mt-5 font-display text-xl uppercase tracking-tight text-paper sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mute sm:text-base">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

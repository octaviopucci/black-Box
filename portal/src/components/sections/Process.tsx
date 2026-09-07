import { processSteps } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Process() {
  return (
    <section id="processo" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader title="Da ideia ao sistema." eyebrow="Processo" />
        </Reveal>

        <div className="relative mt-16">
          <div
            className="pointer-events-none absolute left-[0.55rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent md:block"
            aria-hidden="true"
          />

          <ol className="space-y-10">
            {processSteps.map((step, i) => (
              <li key={step.number} className="relative pl-8 md:pl-10">
                <span
                  className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border border-paper/70 bg-ink"
                  aria-hidden="true"
                />
                <Reveal delay={0.05 * i}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">
                    {step.number} / {step.title}
                  </p>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-silver">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

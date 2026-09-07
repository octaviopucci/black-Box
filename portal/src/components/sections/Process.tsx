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
            className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent md:left-1/2 md:block"
            aria-hidden="true"
          />

          <ol className="space-y-10 md:space-y-0">
            {processSteps.map((step, i) => (
              <Reveal key={step.number} delay={0.05 * i}>
                <li
                  className={`relative grid gap-4 md:grid-cols-2 md:gap-16 md:py-10 ${
                    i % 2 === 1 ? 'md:text-right' : ''
                  }`}
                >
                  <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                    <div
                      className={`absolute left-4 top-2 hidden h-3 w-3 -translate-x-1/2 rounded-full border border-paper/70 bg-ink md:left-1/2 md:block ${
                        i % 2 === 1 ? '' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">
                      {step.number} / {step.title}
                    </p>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-silver md:inline-block">
                      {step.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

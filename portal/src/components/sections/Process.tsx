import { processSteps } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Process() {
  return (
    <section id="processo" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="Como funciona na prática"
            subtitle="Sem jargão. Você conta o problema — a gente entrega a solução pronta para usar."
            eyebrow="Processo"
          />
        </Reveal>

        <ol className="relative mt-16 space-y-10">
          <div
            className="pointer-events-none absolute left-[0.55rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent md:block"
            aria-hidden="true"
          />
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={0.06 * i}>
              <li className="relative list-none pl-8 md:pl-10">
                <span
                  className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border border-paper/70 bg-ink"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium uppercase tracking-wider text-mute">
                  Passo {step.number}
                </p>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-paper">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

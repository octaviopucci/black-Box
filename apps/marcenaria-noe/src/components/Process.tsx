import { Reveal } from '@/components/Reveal'
import { processSteps } from '@/data/site'

export function Process() {
  return (
    <section id="processo" className="border-t border-line px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow mb-4">Processo</p>
          <h2 className="display-title max-w-xl text-[clamp(2rem,5vw,3rem)] text-paper">
            Do briefing à instalação
          </h2>
        </Reveal>

        <ol className="mt-16 space-y-0 border-t border-line">
          {processSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.05}>
              <li className="grid gap-4 border-b border-line py-8 md:grid-cols-[80px_1fr_1.2fr] md:items-baseline md:gap-10 md:py-10">
                <span className="font-brand text-2xl font-medium tabular-nums text-brass/70">
                  {step.step}
                </span>
                <h3 className="font-brand text-2xl font-medium text-paper md:text-3xl">
                  {step.title}
                </h3>
                <p className="text-base font-light leading-relaxed text-paper/55">
                  {step.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

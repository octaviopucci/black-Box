import { useRef } from 'react'
import { site } from '../data/site'
import { useCascadeLine } from '../hooks/useMotion'
import { Reveal, SectionEyebrow } from './Reveal'

export function Journey() {
  const ref = useRef<HTMLElement>(null)
  useCascadeLine(ref)

  return (
    <section id="jornada" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Jornada</SectionEyebrow>
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-void text-balance">
            Do primeiro sinal à resposta clínica.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-[120px_1fr]">
          <div className="relative hidden justify-center lg:flex" aria-hidden>
            <svg className="absolute top-0 h-full w-24" viewBox="0 0 96 640" preserveAspectRatio="none">
              <path
                data-cascade-line
                d="M48 20 C48 120 20 180 48 280 C76 380 20 460 48 560"
                fill="none"
                stroke="#C5E063"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="48" cy="24" r="8" fill="#0A1612" stroke="#C5E063" strokeWidth="2" />
              <circle cx="48" cy="280" r="8" fill="#0A1612" stroke="#9BB8A8" strokeWidth="2" />
              <circle cx="48" cy="556" r="8" fill="#C5E063" />
            </svg>
          </div>

          <ol className="space-y-0">
            {site.journey.map((step, i) => (
              <Reveal key={step.step} delay={0.08 * i}>
                <li className="grid gap-4 border-t border-line py-10 last:border-b sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-12">
                  <div className="flex items-baseline gap-3 sm:flex-col sm:items-start sm:min-w-[5rem]">
                    <span className="font-display text-5xl font-semibold leading-none text-signal-deep">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-void sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">
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

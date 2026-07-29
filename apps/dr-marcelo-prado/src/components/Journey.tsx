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
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-ink text-balance">
            Do primeiro sintoma à modulação contínua.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-[100px_1fr]">
          <div className="relative hidden justify-center lg:flex" aria-hidden>
            <svg className="absolute top-0 h-full w-20" viewBox="0 0 80 560" preserveAspectRatio="none">
              <path
                data-cascade-line
                d="M40 16 C40 120 16 180 40 280 C64 380 16 440 40 540"
                fill="none"
                stroke="#2A7A7D"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="40" cy="20" r="7" fill="#0B0B0B" stroke="#2A7A7D" strokeWidth="2" />
              <circle cx="40" cy="280" r="7" fill="#0B0B0B" stroke="#4F6B58" strokeWidth="2" />
              <circle cx="40" cy="536" r="7" fill="#2A7A7D" />
            </svg>
          </div>

          <ol>
            {site.journey.map((step, i) => (
              <Reveal key={step.step} delay={0.08 * i}>
                <li className="grid gap-4 border-t border-line py-10 last:border-b sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-12">
                  <span className="font-display text-5xl font-semibold leading-none text-aqua">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
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

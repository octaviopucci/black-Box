import { useRef } from 'react'
import { site } from '../data/site'
import { useCascadeLine } from '../hooks/useMotion'
import { Reveal, SectionEyebrow } from './Reveal'

export function Journey() {
  const ref = useRef<HTMLElement>(null)
  useCascadeLine(ref)

  return (
    <section id="jornada" ref={ref} className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Jornada</SectionEyebrow>
          <h2 className="display-title max-w-2xl text-[clamp(2.3rem,5.2vw,3.6rem)] text-ink">
            Do primeiro sintoma à modulação contínua.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-[88px_1fr]">
          <div className="relative hidden justify-center lg:flex" aria-hidden>
            <svg className="absolute top-0 h-full w-16" viewBox="0 0 80 560" preserveAspectRatio="none">
              <path
                data-cascade-line
                d="M40 16 C40 120 16 180 40 280 C64 380 16 440 40 540"
                fill="none"
                stroke="#1A5F62"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="40" cy="20" r="6" fill="#F4F5F3" stroke="#1A5F62" strokeWidth="2" />
              <circle cx="40" cy="280" r="6" fill="#F4F5F3" stroke="#4F6B58" strokeWidth="2" />
              <circle cx="40" cy="536" r="6" fill="#1A5F62" />
            </svg>
          </div>

          <ol>
            {site.journey.map((step, i) => (
              <Reveal key={step.step} delay={0.08 * i}>
                <li className="grid gap-4 border-t border-line py-12 last:border-b sm:grid-cols-[auto_1fr] sm:gap-12">
                  <span className="font-display text-5xl font-semibold leading-none text-aqua sm:text-6xl">
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

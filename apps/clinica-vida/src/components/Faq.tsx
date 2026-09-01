import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faq } from '../data/site'
import { Reveal } from './Reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-vida" aria-hidden />
            Perguntas
          </p>
          <h2 className="display-title text-[clamp(2.2rem,4.5vw,3.2rem)] text-ink">
            O essencial, respondido.
          </h2>
        </Reveal>

        <dl className="mt-14 divide-y divide-ink/10">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={0.05 * i}>
                <div className="py-6">
                  <dt>
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 text-left"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="font-display text-xl font-semibold text-ink sm:text-2xl">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-vida transition duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="mt-4 text-sm leading-relaxed text-mute sm:text-base">{item.a}</dd>
                  )}
                </div>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

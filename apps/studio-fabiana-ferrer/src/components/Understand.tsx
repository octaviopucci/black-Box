import { useState } from 'react'
import { understand } from '@/data/site'
import Reveal from './Reveal'

export default function Understand() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="entenda" className="border-t hairline px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
            Perguntas que o perfil já responde.
          </h2>
        </Reveal>

        <div className="mt-10 max-w-prose border-t hairline">
          {understand.map((item, index) => {
            const isOpen = open === index
            return (
              <Reveal key={item.q}>
                <div className="border-b hairline">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg leading-snug text-ink md:text-xl">
                      {item.q}
                    </span>
                    <span className="mt-1 shrink-0 text-sm text-mute" aria-hidden>
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-5 text-sm leading-relaxed text-mute">{item.a}</p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

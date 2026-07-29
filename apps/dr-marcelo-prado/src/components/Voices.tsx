import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function Voices() {
  return (
    <section className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Vozes</SectionEyebrow>
          <h2 className="display-title max-w-xl text-[clamp(2.3rem,5vw,3.5rem)] text-ink">
            Clareza depois da consulta.
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {site.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.08 * i}>
              <figure className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:gap-16">
                <blockquote className="font-display text-[clamp(1.4rem,3.2vw,2rem)] font-semibold leading-snug tracking-tight text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex flex-col justify-end lg:text-right">
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="mt-1 text-sm text-mute">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="border-t border-line bg-fog-soft/50 py-28 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionEyebrow>Perguntas</SectionEyebrow>
          <h2 className="display-title text-[clamp(2.1rem,4.2vw,3rem)] text-ink">
            Antes de marcar, algumas respostas.
          </h2>
          <p className="mt-4 text-mute">
            Ainda com dúvida? Fale pelo Instagram — o próximo passo começa com uma conversa.
          </p>
        </Reveal>

        <div className="divide-y divide-line border-y border-line">
          {site.faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={0.04 * i}>
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-bold text-ink">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-aqua transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="pb-6 text-sm leading-relaxed text-mute sm:text-base">
                          {item.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

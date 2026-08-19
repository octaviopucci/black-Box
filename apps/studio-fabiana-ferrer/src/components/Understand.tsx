import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { understand } from '@/data/site'
import Reveal from './Reveal'

export default function Understand() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="entenda" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">Entenda</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-forest md:text-4xl">
            Dúvidas que o perfil já responde — mitos, segurança e agendamento.
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {understand.map((item, index) => {
            const isOpen = open === index
            return (
              <Reveal key={item.q} delay={index * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-forest/10 bg-paper/80 shadow-tactile">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-forest">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="mt-0.5 shrink-0 text-xl leading-none text-sage"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="border-t border-forest/8 px-5 py-4 text-sm leading-relaxed text-smoke">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
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

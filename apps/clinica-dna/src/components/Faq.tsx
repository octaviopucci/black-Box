import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { site } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative scroll-mt-24 bg-mist/50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas que ouvimos todo dia"
            subtitle="Transparência desde o primeiro contato — porque confiança começa com clareza."
          />
        </div>

        <div className="lg:col-span-7">
          <ul className="space-y-3">
            {site.faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <Reveal key={item.q} delay={0.04 * i}>
                  <li className="overflow-hidden rounded-2xl border border-line bg-snow">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-navy sm:text-base">{item.q}</span>
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aqua-mist text-navy transition duration-300 ${
                          isOpen ? 'rotate-45 bg-navy text-snow' : ''
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-mute">{item.a}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

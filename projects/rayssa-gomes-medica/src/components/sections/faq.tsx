'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { faq } from '@/data/site'

export function Faq() {
  const reduce = useReducedMotion()

  return (
    <section className="border-t border-ink/8 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Perguntas</p>
          <h2 className="display-title mt-4 text-[clamp(2rem,4vw,2.75rem)] text-ink">
            Antes de agendar
          </h2>
        </motion.div>

        <dl className="mt-12 space-y-8">
          {faq.map((item, index) => (
            <motion.div
              key={item.q}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="border-b border-ink/10 pb-8"
            >
              <dt className="text-base font-semibold text-ink">{item.q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-mute">{item.a}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}

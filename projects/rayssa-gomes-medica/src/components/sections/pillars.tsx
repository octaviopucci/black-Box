'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { pillars } from '@/data/site'

export function Pillars() {
  const reduce = useReducedMotion()

  return (
    <section id="cuidados" className="border-y border-ink/8 bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-paper/55">Cuidados</p>
          <h2 className="display-title mt-4 text-[clamp(2rem,4vw,3rem)]">
            Um olhar clínico para quem busca presença, não pressa.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="border-t border-paper/15 pt-8"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-accent">
                0{index + 1}
              </span>
              <h3 className="display-title mt-4 text-3xl">{pillar.title}</h3>
              <p className="mt-3 text-base font-medium text-paper/80">{pillar.line}</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/62">{pillar.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

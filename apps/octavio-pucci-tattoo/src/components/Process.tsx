import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { process } from '../data/site'

export function Process() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section id="processo" ref={ref} className="border-t border-parchment/5 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="section-label mb-3">Processo</p>
        <h2 className="mb-16 font-brand text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[0.06em] sm:mb-20">
          DO PROJETO À PELE
        </h2>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {process.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <p className="font-brand text-5xl text-copper/40">{step.step}</p>
              <h3 className="mt-4 font-brand text-2xl tracking-[0.06em]">{step.title.toUpperCase()}</h3>
              <p className="mt-3 text-sm leading-relaxed text-parchment/55">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

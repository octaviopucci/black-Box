import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { manifesto } from '../data/site'

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-parchment/5 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p className="section-label mb-10">Manifesto</p>
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          {manifesto.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="font-serif text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.15] text-parchment/88"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

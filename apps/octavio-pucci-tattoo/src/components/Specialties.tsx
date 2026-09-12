import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { specialties } from '../data/site'

export function Specialties() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section id="linguagens" ref={ref} className="border-t border-parchment/5 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-16 flex flex-col gap-4 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label mb-3">Linguagens</p>
            <h2 className="font-brand text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[0.06em]">
              O QUE FAZ NO STUDIO
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-parchment/50">
            Especialidades extraídas do trabalho real publicado no Instagram oficial.
          </p>
        </div>

        <div className="divide-y divide-parchment/10">
          {specialties.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="grid gap-6 py-10 sm:grid-cols-[1fr_1.2fr] sm:gap-12 sm:py-14 lg:grid-cols-[0.9fr_1.1fr_0.8fr]"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-copper/80">{item.id}</p>
                <h3 className="mt-2 font-brand text-3xl tracking-[0.04em] sm:text-4xl">
                  {item.title.toUpperCase()}
                </h3>
                <p className="mt-2 font-serif text-lg italic text-parchment/75">{item.line}</p>
              </div>
              <p className="text-sm leading-relaxed text-parchment/60">{item.detail}</p>
              <div className="sm:text-right">
                <p className="text-xs leading-relaxed text-parchment/45">{item.proof}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-parchment/25">
                  {item.source}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

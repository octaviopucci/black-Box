import { motion } from 'framer-motion'
import { pillars } from '@/data/site'
import { useMotion } from '@/hooks/useMotion'
import Reveal from './Reveal'

export default function Pillars() {
  const { stagger } = useMotion()

  return (
    <section className="px-4 py-16 md:px-8 md:py-24" aria-label="Pilares do cuidado">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">
            Como o studio se posiciona
          </p>
          <h2 className="mt-3 max-w-prose font-display text-3xl font-medium text-forest md:text-4xl">
            Três palavras que aparecem na bio — e guiam cada atendimento.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={stagger * (index + 1)}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group h-full rounded-[1.75rem] border border-forest/8 bg-paper/80 p-6 shadow-tactile backdrop-blur md:p-8"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint text-sm font-bold text-forest">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-2xl text-forest">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-smoke">{pillar.detail}</p>
                <div className="mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-leaf to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

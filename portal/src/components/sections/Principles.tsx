import { principles } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { Stagger, staggerItem } from '../ui/Motion'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Principles() {
  const reduced = useReducedMotion()

  return (
    <section className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="Como pensamos cada projeto"
            subtitle="Por trás de cada solução existe método — e foco total no seu resultado."
            eyebrow="Nosso jeito de trabalhar"
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2" delay={0.05}>
          {principles.map((item) => (
            <motion.article
              key={item.number}
              variants={staggerItem}
              whileHover={reduced ? undefined : { y: -4 }}
              className="bb-panel h-full p-7 sm:p-8"
            >
              <p className="font-mono text-[11px] text-mute">{item.number}</p>
              <h3 className="mt-4 font-display text-xl uppercase tracking-tight text-paper sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-mute">{item.description}</p>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

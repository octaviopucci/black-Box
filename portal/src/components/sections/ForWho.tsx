import { motion } from 'framer-motion'
import { forWho } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { Stagger, staggerItem } from '../ui/Motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ForWho() {
  const reduced = useReducedMotion()

  return (
    <section className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            eyebrow="Para quem é"
            title="Se você sente que sua operação poderia render mais"
            subtitle="A Black Box é para quem quer resultado de verdade — não mais uma ferramenta genérica que ninguém usa."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2" delay={0.1}>
          {forWho.map((item) => (
            <motion.article
              key={item.title}
              variants={staggerItem}
              whileHover={reduced ? undefined : { y: -4 }}
              className="bb-panel group p-7 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] sm:p-8"
            >
              <h3 className="font-display text-xl uppercase tracking-tight text-paper transition group-hover:text-silver sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-mute">{item.text}</p>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

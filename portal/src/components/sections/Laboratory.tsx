import { labItems } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { Stagger, staggerItem } from '../ui/Motion'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Laboratory() {
  const reduced = useReducedMotion()

  return (
    <section id="laboratorio" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="O que estamos testando agora"
            subtitle="Ideias novas viram produto — e depois, solução para clientes como você."
            eyebrow="Inovação"
          />
        </Reveal>

        <Stagger className="mt-14 space-y-3" delay={0.05}>
          {labItems.map((item) => (
            <motion.article
              key={item.title}
              variants={staggerItem}
              whileHover={reduced ? undefined : { x: 4 }}
              className="bb-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div>
                <h3 className="font-display text-lg uppercase tracking-tight text-paper sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">{item.teaser}</p>
              </div>
              <span className="shrink-0 self-start rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-silver sm:self-center">
                {item.status}
              </span>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

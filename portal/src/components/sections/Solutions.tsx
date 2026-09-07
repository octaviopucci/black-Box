import { motion } from 'framer-motion'
import { solutions } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { Stagger, staggerItem } from '../ui/Motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Solutions() {
  const reduced = useReducedMotion()

  return (
    <section id="solucoes" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="O que podemos construir para você"
            subtitle="Cada solução começa com um problema do seu negócio — e termina com resultado mensurável."
            eyebrow="Soluções"
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {solutions.map((solution) => (
            <motion.article
              key={solution.number}
              variants={staggerItem}
              whileHover={reduced ? undefined : { y: -6, transition: { duration: 0.3 } }}
              className="bb-panel group flex h-full flex-col p-6 sm:p-7"
            >
              <p className="font-mono text-[11px] text-mute">{solution.number}</p>
              <h3 className="mt-4 font-display text-xl uppercase leading-tight tracking-tight text-paper transition group-hover:text-silver">
                {solution.title}
              </h3>
              <p className="mt-3 text-sm font-medium text-silver">{solution.benefit}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{solution.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                {solution.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-silver transition group-hover:border-white/25"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

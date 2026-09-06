import { motion } from 'framer-motion'
import { readoutIntro } from '../data/site'
import { ReadoutReport } from './readout/ReadoutReport'

export function Readout() {
  return (
    <section className="relative bg-paper px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          Exemplo de laudo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="display-title max-w-lg text-[clamp(2rem,4.4vw,3rem)] text-ink"
        >
          O que o exame revela
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-mute"
        >
          {readoutIntro}
        </motion.p>

        <ReadoutReport />
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { readoutIntro, site, asset } from '../data/site'

const reportSample = asset(site.media.reportSample)

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-sm border border-line bg-paper-deep shadow-lift"
        >
          <img
            src={reportSample}
            alt="Exemplo de laudo de Calorimetria Indireta com gráficos de VO₂, TMB e ventilação"
            className="block w-full"
            width={736}
            height={1600}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}

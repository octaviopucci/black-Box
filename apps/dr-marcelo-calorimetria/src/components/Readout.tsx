import { motion } from 'framer-motion'
import { metrics, readoutIntro, site, asset } from '../data/site'

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

        <div className="mt-14 divide-y divide-line border-y border-line">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-soft">{metric.code}</p>
                <h3 className="mt-1 font-display text-lg text-ink">{metric.label}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-mute">{metric.description}</p>
              </div>
              <p className="font-mono text-3xl text-ink sm:text-right sm:text-4xl">
                {metric.value}
                {metric.unit && <span className="ml-1.5 text-sm text-mute">{metric.unit}</span>}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-mute"
        >
          Valores ilustrativos — o seu resultado é individual
        </motion.p>
      </div>
    </section>
  )
}

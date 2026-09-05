import { motion } from 'framer-motion'
import { problemLines, site, asset } from '../data/site'
import { HarrisBenedictCalc } from './HarrisBenedictCalc'

const vsMontage = asset(site.media.vsMontage)

export function ProblemStatement() {
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
          O problema
        </motion.p>

        <div className="mt-4 space-y-2">
          {problemLines.map((item, i) => (
            <motion.p
              key={item.line}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={
                item.emphasis
                  ? 'display-title text-[clamp(1.9rem,4.4vw,3.1rem)] text-ink'
                  : 'font-display text-[clamp(1.4rem,3vw,2.1rem)] text-mute'
              }
            >
              {item.line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 overflow-hidden rounded-sm bg-ink shadow-lift"
        >
          <img
            src={vsMontage}
            alt="Calculadora versus analisador metabólico portátil"
            className="block w-full"
            width={2752}
            height={1536}
            loading="lazy"
          />
        </motion.div>

        <HarrisBenedictCalc />
      </div>
    </section>
  )
}

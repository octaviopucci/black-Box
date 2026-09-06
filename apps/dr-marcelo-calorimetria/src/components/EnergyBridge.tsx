import { motion } from 'framer-motion'
import { energyBridge } from '../data/site'

export function EnergyBridge() {
  return (
    <section className="relative bg-paper-deep px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(1.5rem,3.6vw,2.25rem)] leading-snug text-ink"
        >
          {energyBridge}
        </motion.p>
      </div>
    </section>
  )
}

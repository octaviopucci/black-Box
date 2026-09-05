import { motion } from 'framer-motion'
import { site, asset } from '../data/site'

export function AboutDoctor() {
  return (
    <section className="relative bg-paper px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm overflow-hidden rounded-sm"
        >
          <img
            src={asset('doctor-portrait.jpg')}
            alt={site.name}
            className="block w-full"
            width={900}
            height={1009}
            loading="lazy"
          />
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            Quem interpreta o exame
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="display-title max-w-md text-[clamp(1.9rem,3.6vw,2.6rem)] text-ink"
          >
            {site.name}
          </motion.h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-teal-soft">
            {site.specialty} · {site.crm}
          </p>

          <div className="mt-6 space-y-4">
            {site.about.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                className="max-w-lg text-[15px] leading-relaxed text-mute"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

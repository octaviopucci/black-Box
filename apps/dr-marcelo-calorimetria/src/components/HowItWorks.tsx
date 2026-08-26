import { motion } from 'framer-motion'
import { journey, site, asset } from '../data/site'

const devicePhoto = asset(site.media.devicePhoto)

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative overflow-hidden bg-ink px-6 py-28 text-paper sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 85% 0%, rgba(47,166,160,0.16), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="eyebrow-light"
        >
          Como funciona
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="display-title max-w-md text-[clamp(2rem,4.4vw,3rem)]"
        >
          Uma respiração tranquila. Um número exato.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-sm bg-paper/5 ring-1 ring-paper/10"
        >
          <img
            src={devicePhoto}
            alt="Analisador metabólico portátil VO2 Master com máscara respiratória"
            className="block w-full max-w-md mx-auto"
            width={554}
            height={554}
            loading="lazy"
          />
        </motion.div>

        <div className="mt-14 space-y-10">
          {journey.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-6 border-t border-paper/12 pt-6"
            >
              <span className="font-mono text-sm text-teal-bright">{step.step}</span>
              <div>
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-paper/70">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

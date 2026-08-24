import { motion } from 'framer-motion'
import { journey, asset } from '../data/site'

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
      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
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
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-paper/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative self-start"
        >
          <div className="relative overflow-hidden rounded-sm bg-ink-lift">
            <img
              src={asset('device-session.jpg')}
              alt="Analisador metabólico portátil HandyMET utilizado no exame de calorimetria indireta, no consultório do Dr. Marcelo Prado"
              className="block w-full"
              width={370}
              height={344}
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background: 'linear-gradient(to top, rgba(10,18,17,0.45), transparent)',
              }}
            />
          </div>
          <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/45">
            Analisador metabólico · exame real de calorimetria indireta
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

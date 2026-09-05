import { motion } from 'framer-motion'
import { audiences, audienceIntro } from '../data/site'

export function Audience() {
  return (
    <section className="relative bg-ink px-6 py-28 text-paper sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="eyebrow-light"
        >
          Para quem é
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="display-title max-w-lg text-[clamp(2rem,4.4vw,3rem)]"
        >
          Um exame, três caminhos
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-paper/72"
        >
          {audienceIntro}
        </motion.p>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {audiences.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-paper/15 pt-6"
            >
              <span className="font-mono text-xs text-teal-bright">{`0${i + 1}`}</span>
              <h3 className="mt-3 font-display text-xl leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

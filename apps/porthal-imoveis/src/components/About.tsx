import { motion } from 'framer-motion'
import { site, whatsappUrl } from '../data/site'

export function About() {
  return (
    <section id="sobre" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">A marca</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] sm:text-7xl">
            Porthal
            <span className="block italic text-ink/70">com critério</span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-mute">
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] bg-brand p-8 text-white sm:p-10"
        >
          <p className="font-display text-4xl leading-tight sm:text-5xl">
            Transparência, ética e atendimento próximo em cada negociação.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white"
          >
            Conversar com a Porthal
          </a>
        </motion.div>
      </div>
    </section>
  )
}

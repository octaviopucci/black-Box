import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { site, bookingUrl } from '../data/site'
import { BreathWave } from './BreathWave'

function InstagramGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function Booking() {
  return (
    <section id="agendar" className="relative overflow-hidden bg-ink px-6 py-28 text-paper sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(47,166,160,0.2), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="eyebrow-light justify-center"
        >
          Agende o seu exame
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="display-title mx-auto max-w-2xl text-[clamp(2.1rem,5vw,3.6rem)]"
        >
          Meça o que o seu corpo já sabe.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-paper/70"
        >
          Fale com o Dr. Marcelo pelo Instagram ou pelo Linktree e agende sua Calorimetria Indireta em Capão Bonito ou Itapeva.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-solid">
            Agendar pelo Linktree
          </a>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="cta-ghost-light">
            <InstagramGlyph />
            {site.instagramHandle}
          </a>
        </motion.div>

        <div className="mx-auto mt-20 grid gap-8 border-t border-paper/12 pt-12 text-left sm:grid-cols-2">
          {site.locations.map((loc, i) => (
            <motion.a
              key={loc.id}
              href={loc.mapsUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group flex items-start gap-3 text-paper/75 transition hover:text-paper"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-bright" />
              <span>
                <span className="block font-display text-base text-paper">{loc.city}</span>
                <span className="mt-1 block text-sm leading-relaxed text-paper/60 group-hover:text-paper/80">
                  {loc.address}
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      <BreathWave tone="light" className="mx-auto mt-20 h-10 w-full max-w-none opacity-30" />
    </section>
  )
}

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { highlights } from '../data/properties'

export function RuralHighlights() {
  return (
    <section id="destaques" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(196,52,42,0.05),transparent_30%),radial-gradient(ellipse_at_bottom_right,rgba(18,14,12,0.04),transparent_45%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Campo & natureza
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
            Sítios e chácaras
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Refúgios com água, verde e espaço — para viver, receber e investir com qualidade.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative min-h-[420px] overflow-hidden rounded-[1.4rem]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-luxury group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/72">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-soft">
                  Conhecer
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

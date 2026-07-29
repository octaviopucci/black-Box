import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { highlights } from '../data/properties'

export function RuralHighlights() {
  return (
    <section id="destaques" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,52,42,0.28),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-soft">
            Campo & natureza
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Sítios e chácaras com comodidade
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Refúgios com água, verde e espaço para viver — oportunidades selecionadas para quem
            busca qualidade de vida e patrimônio sólido.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="group relative min-h-[380px] overflow-hidden rounded-2xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">
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

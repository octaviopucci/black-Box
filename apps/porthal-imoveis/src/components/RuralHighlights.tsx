import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { highlights, getPropertyBySlug } from '../data/properties'

export function RuralHighlights() {
  return (
    <section id="destaques" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Campo & natureza
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Sítios e chácaras
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Refúgios selecionados com água, verde e espaço para viver bem.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const linked = item.slug ? getPropertyBySlug(item.slug) : undefined
            const content = (
              <>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-luxury group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-2xl font-semibold leading-tight">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                  {linked ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-soft">
                      Ver detalhes
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
              </>
            )

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="group relative min-h-[400px] overflow-hidden rounded-3xl"
              >
                {linked ? (
                  <Link to={`/imovel/${encodeURIComponent(linked.slug)}`} className="absolute inset-0">
                    {content}
                  </Link>
                ) : (
                  <div className="absolute inset-0">{content}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

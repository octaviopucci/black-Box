import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { highlights, getPropertyBySlug } from '../data/properties'

export function RuralHighlights() {
  return (
    <section id="destaques" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">Campo</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] sm:text-7xl">
            Sítios &amp; chácaras
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const linked = item.slug ? getPropertyBySlug(item.slug) : undefined
            const inner = (
              <>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-3xl leading-tight">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm text-white/70">{item.description}</p>
                  {linked ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-soft">
                      Abrir imóvel <ArrowUpRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
              </>
            )
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative min-h-[440px] overflow-hidden rounded-[1.75rem]"
              >
                {linked ? (
                  <Link to={`/imovel/${encodeURIComponent(linked.slug)}`} className="absolute inset-0">
                    {inner}
                  </Link>
                ) : (
                  <div className="absolute inset-0">{inner}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

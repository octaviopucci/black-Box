import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { saleProperties } from '../data/properties'

export function FeaturedShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const list = saleProperties.slice(0, 10)

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  return (
    <section className="pb-8 pt-4">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">Coleção</p>
          <h2 className="mt-2 font-display text-4xl leading-none sm:text-6xl">Em evidência</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="rounded-full border border-line bg-white p-3 text-ink transition hover:border-brand hover:text-brand"
            aria-label="Anterior"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="rounded-full border border-line bg-white p-3 text-ink transition hover:border-brand hover:text-brand"
            aria-label="Próximo"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="hide-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:px-8"
      >
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.55 }}
            className="w-[82vw] max-w-[420px] shrink-0 snap-start sm:w-[380px]"
          >
            <Link
              to={`/imovel/${encodeURIComponent(p.slug)}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-ink"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition duration-[900ms] ease-luxury group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-soft">
                  À vista · {p.cashPrice}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-white/65">{p.address}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

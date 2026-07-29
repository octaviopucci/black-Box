import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'
import { cleanTitle } from '../lib/filters'
import { ease } from '../lib/motion'

const slides = saleProperties.filter((p) => p.image).slice(0, 8)

export function Hero() {
  const [index, setIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 140])
  const opacity = useTransform(scrollY, [0, 520], [1, 0.35])
  const scale = useTransform(scrollY, [0, 700], [1, 1.08])

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => window.clearInterval(id)
  }, [])

  const current = slides[index]

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 will-change-transform">
        <AnimatePresence mode="sync">
          <motion.div
            key={current?.id ?? index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.55, ease }}
          >
            <img
              src={current?.image}
              alt={current ? cleanTitle(current.title) : site.name}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(18,17,16,0.92)_0%,rgba(18,17,16,0.45)_48%,rgba(31,58,48,0.35)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(196,52,42,0.22),transparent_55%)]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />

      <div className="relative z-10 container-page flex min-h-[100svh] flex-col justify-end pb-14 pt-28 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease }}
          className="max-w-4xl"
        >
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/55">
            {site.tagline}
          </p>
          <h1 className="font-display text-[clamp(4rem,14vw,8.5rem)] leading-[0.86] tracking-tight">
            Porthal
            <span className="mt-1 block font-display italic text-white/88">Imóveis</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
            Curadoria imobiliária em Capão Bonito e região — compra, venda e locação com
            transparência e valores à vista sem atrito.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#comprar" className="btn-primary">
              Comprar
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a href="#alugar" className="btn-ghost border-white/30 text-white">
              Alugar
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-3 text-sm text-white/65 underline-offset-4 transition hover:text-white hover:underline"
            >
              Atendimento imediato
            </a>
          </div>
        </motion.div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
          <div className="flex items-center gap-2" role="tablist" aria-label="Destaques do hero">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Destaque ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[2px] transition-all duration-500 ${
                  i === index ? 'w-12 bg-brand' : 'w-5 bg-white/30 hover:bg-white/55'
                }`}
              />
            ))}
          </div>

          {current ? (
            <Link
              to={`/imovel/${encodeURIComponent(current.slug)}`}
              className="group max-w-md text-right transition"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/40">
                À vista · {current.cashPrice}
              </span>
              <span className="mt-1 inline-flex items-center gap-2 text-sm text-white/75 group-hover:text-white">
                {cleanTitle(current.title)}
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

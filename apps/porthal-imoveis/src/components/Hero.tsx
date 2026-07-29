import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'

const slides = saleProperties.filter((p) => p.image).slice(0, 7)

export function Hero() {
  const [index, setIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 400], [1, 0.4])

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => window.clearInterval(id)
  }, [])

  const current = slides[index]

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current?.id ?? index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={current?.image}
              alt={current?.title ?? 'Porthal Imóveis'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,11,10,0.9)_0%,rgba(12,11,10,0.4)_55%,rgba(196,52,42,0.28)_100%)]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
            {site.tagline}
          </p>
          <h1 className="font-display text-[clamp(3.4rem,10vw,7rem)] font-semibold leading-[0.9] tracking-tight">
            Porthal
            <span className="mt-1 block italic font-medium text-white/90">Imóveis</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Imobiliária premium em Capão Bonito — compra, venda e locação com curadoria, transparência
            e valores à vista claros.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#comprar"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
            >
              Comprar
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#alugar"
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16"
            >
              Alugar
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-2 text-sm text-white/65 underline-offset-4 hover:text-white hover:underline"
            >
              Atendimento
            </a>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-6">
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Destaque ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[3px] rounded-full transition-all ${
                  i === index ? 'w-10 bg-brand' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
          {current ? (
            <Link
              to={`/imovel/${encodeURIComponent(current.slug)}`}
              className="max-w-sm text-right text-sm text-white/70 transition hover:text-white"
            >
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                À vista · {current.cashPrice}
              </span>
              {current.title}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

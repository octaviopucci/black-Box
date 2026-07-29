import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'

const slides = saleProperties.filter((p) => p.image).slice(0, 7)

export function Hero() {
  const [index, setIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])
  const opacity = useTransform(scrollY, [0, 420], [1, 0.35])

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slides[index]?.id ?? index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={slides[index]?.image}
              alt={slides[index]?.title ?? 'Imóvel Porthal'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(18,14,12,0.88)_0%,rgba(18,14,12,0.42)_52%,rgba(196,52,42,0.32)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(18,14,12,0.6),transparent_58%)]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/65">
            {site.tagline} · Capão Bonito
          </p>
          <h1 className="font-display text-[clamp(3.6rem,11vw,7.4rem)] font-semibold leading-[0.88] tracking-tight">
            Porthal
            <span className="mt-1 block italic text-white/88">Imóveis</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/78 sm:text-lg">
            Compra, venda e locação com curadoria de alto padrão — residências, sítios e pontos
            comerciais selecionados para quem busca patrimônio e qualidade de vida.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#comprar"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
            >
              Comprar
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#alugar"
              className="inline-flex items-center rounded-full border border-white/35 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/70 hover:bg-white/14"
            >
              Alugar
            </a>
            <a
              href={whatsappUrl('Olá! Quero atendimento premium da Porthal Imóveis.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-2 text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Atendimento exclusivo
            </a>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ver destaque ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === index ? 'w-12 bg-brand' : 'w-5 bg-white/30 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
          <p className="max-w-xs text-right text-[11px] uppercase tracking-[0.24em] text-white/45">
            {slides[index]?.title}
          </p>
        </div>
      </div>
    </section>
  )
}

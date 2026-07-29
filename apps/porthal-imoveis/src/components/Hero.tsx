import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { properties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'

const slides = properties.filter((p) => p.image).slice(0, 6)

export function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <AnimatePresence mode="sync">
        <motion.div
          key={slides[index]?.id ?? index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={slides[index]?.image}
            alt={slides[index]?.title ?? 'Imóvel Porthal'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(23,19,17,0.82)_0%,rgba(23,19,17,0.45)_48%,rgba(196,52,42,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(23,19,17,0.55),transparent_55%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            {site.tagline}
          </p>
          <h1 className="font-display text-[clamp(3.2rem,9vw,6.5rem)] font-semibold leading-[0.92] tracking-tight">
            Porthal
            <span className="block text-white/90">Imóveis</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Consultoria imobiliária de alto padrão em Capão Bonito e região — sítios, chácaras e
            residências selecionadas com atendimento próximo e transparente.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#imoveis"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
            >
              Explorar imóveis
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href={whatsappUrl('Olá! Quero atendimento da Porthal Imóveis.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
            >
              Atendimento exclusivo
            </a>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ver destaque ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? 'w-10 bg-brand' : 'w-5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

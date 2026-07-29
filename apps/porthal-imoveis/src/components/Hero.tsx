import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { site } from '../data/site'

const slides = saleProperties.filter((p) => p.image).slice(0, 8)

export function Hero() {
  const [index, setIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 180])
  const opacity = useTransform(scrollY, [0, 500], [1, 0.25])

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500)
    return () => window.clearInterval(id)
  }, [])

  const current = slides[index]

  return (
    <section id="topo" className="relative flex min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={current?.id}
            src={current?.image}
            alt={current?.title ?? 'Porthal'}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.4)_0%,rgba(10,9,8,0.2)_35%,rgba(10,9,8,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,52,42,0.35),transparent_45%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-8 px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/70 sm:text-[11px] sm:tracking-[0.45em]"
        >
          Capão Bonito · {site.tagline}
        </motion.p>

        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-w-0 font-sans text-[clamp(2.5rem,calc((100vw-2.75rem)/6.35),9.5rem)] font-extrabold leading-[0.86] tracking-[-0.05em]"
          >
            <span className="block whitespace-nowrap">PORTHAL</span>
            <span className="mt-3 block font-display text-[clamp(1.35rem,4.8vw,3.6rem)] font-normal italic tracking-normal text-white/85">
              imóveis de alto padrão
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"
          >
            <p className="max-w-md text-sm leading-relaxed text-white/75 sm:text-lg">
              Uma nova vitrine para comprar e alugar — curadoria local, valores à vista e atendimento
              próximo.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#comprar"
                className="rounded-full bg-brand px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-brand-deep sm:px-7 sm:text-xs sm:tracking-[0.18em]"
              >
                Explorar venda
              </a>
              <a
                href="#alugar"
                className="rounded-full border border-white/35 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/10 sm:px-7 sm:text-xs sm:tracking-[0.18em]"
              >
                Ver aluguel
              </a>
            </div>
          </motion.div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-4 sm:pt-5">
          {current ? (
            <Link to={`/imovel/${encodeURIComponent(current.slug)}`} className="group min-w-0 max-w-[70%] sm:max-w-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-soft sm:tracking-[0.24em]">
                Destaque · à vista {current.cashPrice}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-white/80 transition group-hover:text-white">
                {current.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          <a
            href="#colecao"
            className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 sm:text-[11px] sm:tracking-[0.2em]"
          >
            Descer
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}

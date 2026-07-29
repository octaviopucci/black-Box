import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { site } from '../data/site'

/** Prefer wide outdoor shots and skip heavily watermarked close-ups when possible. */
const slides = saleProperties
  .filter((p) => p.image)
  .filter((p) => {
    const t = p.title.toLowerCase()
    return t.includes('sítio') || t.includes('sitio') || t.includes('fazenda') || t.includes('chácara') || t.includes('chacara') || t.includes('terreno') || t.includes('área') || t.includes('area')
  })
  .slice(0, 8)

const heroSlides = slides.length >= 4 ? slides : saleProperties.filter((p) => p.image).slice(0, 8)

export function Hero() {
  const [index, setIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 160])
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3])

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 5500)
    return () => window.clearInterval(id)
  }, [])

  const current = heroSlides[index]

  return (
    <section id="topo" className="relative flex min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={current?.id}
            src={current?.image}
            alt={current?.title ?? 'Porthal'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
        </AnimatePresence>
        {/* Heavy left/bottom scrim so photo watermarks don't fight the brand type */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.88)_0%,rgba(10,9,8,0.55)_42%,rgba(10,9,8,0.25)_70%,rgba(10,9,8,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.45)_0%,transparent_28%,rgba(10,9,8,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,52,42,0.28),transparent_42%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-8 px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/75 sm:text-[11px] sm:tracking-[0.4em]"
        >
          Capão Bonito · {site.tagline}
        </motion.p>

        <div className="relative min-w-0 max-w-5xl">
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[2rem] bg-ink/35 blur-2xl sm:-inset-x-8" />

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* SVG forces the full word to always fit the container width */}
            <svg
              viewBox="0 0 320 56"
              className="block h-auto w-full"
              role="img"
              aria-label="Porthal"
            >
              <text
                x="0"
                y="48"
                fill="currentColor"
                fontFamily="Syne, system-ui, sans-serif"
                fontWeight="800"
                fontSize="54"
                letterSpacing="-2.5"
                textLength="320"
                lengthAdjust="spacingAndGlyphs"
              >
                PORTHAL
              </text>
            </svg>
            <p className="mt-2 font-display text-[clamp(1.4rem,5vw,3.4rem)] italic leading-none text-white/88">
              imóveis de alto padrão
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.75 }}
            className="relative mt-6 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="max-w-md text-sm leading-relaxed text-white/80 sm:text-lg">
              Uma nova vitrine para comprar e alugar — curadoria local, valores à vista e atendimento
              próximo.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#comprar"
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-brand-deep"
              >
                Explorar venda
              </a>
              <a
                href="#alugar"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white/12"
              >
                Ver aluguel
              </a>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-end justify-between gap-4 border-t border-white/15 pt-4 sm:pt-5">
          {current ? (
            <Link
              to={`/imovel/${encodeURIComponent(current.slug)}`}
              className="group min-w-0 max-w-[72%] sm:max-w-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-soft">
                Destaque · à vista {current.cashPrice}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-white/85 transition group-hover:text-white">
                {current.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          <a
            href="#colecao"
            className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65"
          >
            Descer
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}

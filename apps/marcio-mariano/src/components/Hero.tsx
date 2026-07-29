import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import gsap from 'gsap'
import { featuredProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'

type Slide = {
  src: string
  label: string
  slug?: string
  price?: string
}

const slides: Slide[] = [
  { src: `${import.meta.env.BASE_URL}hero-1.jpg`, label: 'Capão Bonito' },
  { src: `${import.meta.env.BASE_URL}hero-2.jpg`, label: `Desde ${site.since}` },
  ...featuredProperties
    .filter((p) => p.image)
    .slice(0, 4)
    .map((p) => ({ src: p.image, label: p.title, slug: p.slug, price: p.price })),
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 140])
  const opacity = useTransform(scrollY, [0, 450], [1, 0.35])
  const parallaxX = useTransform(mx, [-0.5, 0.5], [-18, 18])
  const parallaxY = useTransform(my, [-0.5, 0.5], [-12, 12])

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!titleRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = titleRef.current.querySelectorAll('[data-word]')
    gsap.fromTo(
      words,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out', delay: 0.15 },
    )
  }, [])

  const onMove = (e: MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const current = slides[index]

  return (
    <section
      id="topo"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-[100svh] overflow-hidden bg-navy text-white"
    >
      <motion.div style={{ y, opacity, x: parallaxX }} className="absolute inset-[-3%]">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.src + index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: parallaxY }}
          >
            <img
              src={current.src}
              alt={current.label}
              className="h-full w-full object-cover"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(6,20,38,0.92)_0%,rgba(11,31,58,0.55)_48%,rgba(12,74,140,0.35)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(196,163,90,0.18),transparent_45%)]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.38em] text-gold-soft"
          >
            Capão Bonito · desde {site.since}
          </motion.p>

          <h1
            ref={titleRef}
            className="font-display text-[clamp(3.2rem,11vw,7.2rem)] font-semibold leading-[0.88] tracking-tight"
          >
            <span data-word className="inline-block">
              Márcio
            </span>{' '}
            <span data-word className="inline-block italic font-medium text-gold-soft">
              Mariano
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {site.tagline}. Compra, venda e locação com a solidez de uma família no mercado há
            gerações.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#buscar"
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
            >
              Encontrar imóvel
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#legado"
              data-cursor="hover"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/14"
            >
              Nossa história
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-2 text-sm text-white/65 underline-offset-4 hover:text-white hover:underline"
            >
              Atendimento
            </a>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-6">
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src + i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[3px] rounded-full transition-all ${
                  i === index ? 'w-10 bg-gold' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
          {current.slug ? (
            <Link
              to={`/imovel/${encodeURIComponent(current.slug)}`}
              className="max-w-sm text-right text-sm text-white/70 transition hover:text-white"
            >
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                Destaque · {current.price}
              </span>
              {current.label}
            </Link>
          ) : (
            <p className="text-sm text-white/55">{current.label}</p>
          )}
        </div>
      </div>
    </section>
  )
}

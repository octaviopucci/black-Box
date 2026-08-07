import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { site, whatsappUrl } from '../data/site'

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])
  const opacity = useTransform(scrollY, [0, 400], [1, 0.4])

  useEffect(() => {
    if (!titleRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = titleRef.current.querySelectorAll('[data-word]')
    gsap.fromTo(
      words,
      { y: 56, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: 'power3.out', delay: 0.12 },
    )
  }, [])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-blue-deep text-white"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}hero-1.jpg`}
          alt="Imóveis e cidade em Capão Bonito"
          className="h-full w-full scale-105 object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-hero-veil" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(249,195,34,0.16),transparent_42%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-shell flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="font-display text-[clamp(3rem,10vw,6.4rem)] font-semibold leading-[0.92] tracking-tight"
          >
            <span data-word className="inline-block">
              Márcio
            </span>{' '}
            <span data-word className="inline-block text-gold">
              Mariano
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="mt-5 font-display text-xl font-medium text-white sm:text-2xl"
          >
            {site.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.52 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/78 hyphens-none sm:text-lg"
          >
            Compra, venda e locação em Capão Bonito e região, com a solidez de uma família no
            mercado desde {site.since}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link to="/imoveis" className="btn-primary">
              Encontrar imóvel
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn-secondary">
              Falar com a equipe
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-sm text-white/55"
        >
          <p>Capão Bonito · sede própria na Rua Silva Jardim, 773</p>
          <p className="text-gold/90">Tradição familiar desde {site.since}</p>
        </motion.div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { media, site, whatsappHref } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const reduced = useReducedMotion()
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !imageRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [reduced])

  const words = ['Móveis', 'de', 'alto', 'padrão']

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Sala de jantar luxuosa — projeto Marcenaria Noé"
          className="h-[120%] w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroVeil" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <div className="max-w-3xl">
          <motion.p
            className="eyebrow mb-6"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {site.promise}
          </motion.p>

          <h1 className="sr-only">{site.name} — {site.tagline}</h1>
          <div
            className="font-brand text-[clamp(4.5rem,16vw,11rem)] font-semibold leading-[0.82] tracking-[-0.03em] text-paper"
            aria-hidden
          >
            Noé
          </div>

          <motion.p
            className="mt-6 max-w-md text-lg font-light leading-relaxed text-paper/75 md:text-xl"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35 }}
          >
            {words.map((word, i) => (
              <motion.span
                key={word}
                className="mr-[0.28em] inline-block"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45 + i * 0.07 }}
              >
                {word}
              </motion.span>
            ))}
            <span className="text-paper/50"> — </span>
            <span className="text-paper/65">{site.description}</span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.85 }}
          >
            <a href={whatsappHref()} className="cta-brass group">
              Solicitar orçamento
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#portfolio" className="cta-ghost">
              Ver projetos
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

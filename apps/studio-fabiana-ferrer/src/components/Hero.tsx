import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { brand } from '@/data/site'

const words = ['Fabiana', 'Ferrer']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '12%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.05])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '6%'])

  return (
    <section id="inicio" ref={ref} className="relative isolate h-dvh min-h-[36rem]">
      {/* Camada de mídia — overflow só aqui, não no texto */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 origin-center will-change-transform"
        >
          <img
            src={`${import.meta.env.BASE_URL}media/7.jpg`}
            alt="Depilação a laser no Studio Fabiana Ferrer em Sorocaba"
            className="h-full w-full object-cover object-[center_25%]"
            loading="eager"
          />
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
        />
      </div>

      {/* Conteúdo — fora do overflow-hidden */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex h-full w-full min-w-0 flex-col justify-end px-6 pb-16 pt-28 sm:px-8 md:px-10 md:pb-20"
      >
        <div className="w-full min-w-0 max-w-measure">
          <p className="text-[0.68rem] font-medium uppercase tracking-mark text-white">
            Laser e Estética · Centro
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.6rem,12vw,7rem)] font-medium leading-[0.92] tracking-tight text-white">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className="block"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: reduced ? 0 : 0.12 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-white md:text-lg">
            {brand.inclusion}
          </p>

          <a
            href={brand.instagramDm}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block border-b border-white/60 pb-1 text-[0.75rem] font-medium uppercase tracking-mark text-white transition hover:border-white"
          >
            {brand.cta}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

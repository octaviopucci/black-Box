import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { brand } from '@/data/site'

const words = ['Fabiana', 'Ferrer']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '10%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, reduced ? 1.08 : 1.14])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '5%'])

  return (
    <section id="inicio" ref={ref} className="relative isolate h-dvh min-h-[36rem]">
      {/* Foto sem texto embutido no topo — media/2, enquadrada para cortar legenda inferior */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 origin-center will-change-transform"
        >
          <img
            src={`${import.meta.env.BASE_URL}media/2.jpg`}
            alt="Atendimento de depilação a laser no Studio Fabiana Ferrer"
            className="h-full w-full object-cover object-[52%_22%]"
            loading="eager"
          />
        </motion.div>

        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"
        />
      </div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 box-border flex h-full w-full flex-col justify-end pb-[max(4rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-28 sm:pl-8 sm:pr-8 md:pb-20 md:pl-10 md:pr-10"
      >
        <div className="w-full max-w-measure">
          <p className="text-[0.68rem] font-medium uppercase tracking-mark text-white">
            Laser e Estética · Centro
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,11vw,6.5rem)] font-medium leading-[0.92] tracking-tight text-white">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className="block overflow-visible"
                initial={reduced ? false : { opacity: 0, y: 20 }}
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
            className="mt-10 inline-block border-b border-white/70 pb-1 text-[0.75rem] font-medium uppercase tracking-mark text-white"
          >
            {brand.cta}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

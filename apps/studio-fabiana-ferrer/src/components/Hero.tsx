import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { brand } from '@/data/site'

const words = ['Fabiana', 'Ferrer']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.06])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '8%'])

  return (
    <section id="inicio" ref={ref} className="relative h-dvh min-h-[36rem] overflow-hidden">
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 origin-center will-change-transform"
      >
        <img
          src={`${import.meta.env.BASE_URL}media/7.jpg`}
          alt="Depilação a laser no Studio Fabiana Ferrer em Sorocaba"
          className="h-full w-full object-cover object-[center_20%]"
          loading="eager"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'var(--hero-fade)' }}
      />

      <motion.div
        style={{ y: contentY }}
        className="relative flex h-full flex-col justify-end px-5 pb-14 pt-28 md:px-10 md:pb-20"
      >
        <div className="mx-auto w-full max-w-[90rem]">
          <p className="text-[0.68rem] font-medium uppercase tracking-mark text-paper/65">
            Laser e Estética · Centro
          </p>

          <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3.4rem,11vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.03em] text-paper">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className="block"
                initial={reduced ? false : { opacity: 0, y: 28 }}
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

          <p className="mt-6 max-w-measure text-pretty text-base leading-relaxed text-paper/82 md:text-lg">
            {brand.inclusion}
          </p>

          <a
            href={brand.instagramDm}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block border-b border-paper/50 pb-1 text-[0.75rem] font-medium uppercase tracking-mark text-paper transition hover:border-paper"
          >
            {brand.cta}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { carouselSlides } from '@/data/site'

type HeroCarouselProps = {
  className?: string
}

export function HeroCarousel({ className }: HeroCarouselProps) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const total = carouselSlides.length

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(next, 5500)
    return () => window.clearInterval(timer)
  }, [next, reduce])

  return (
    <div className={className}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={carouselSlides[index].file}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={carouselSlides[index].file}
            alt=""
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-[#3d2518]/88 via-[#3d2518]/45 to-[#f2e9e1]/20" />
      <div className="absolute inset-0 bg-linear-to-r from-[#3d2518]/75 via-[#3d2518]/35 to-transparent md:from-[#3d2518]/65 md:via-[#3d2518]/25" />

      <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-3 md:bottom-10">
        {carouselSlides.map((slide, slideIndex) => (
          <button
            key={slide.file}
            type="button"
            aria-label={`Slide ${slideIndex + 1}`}
            aria-current={slideIndex === index ? 'true' : undefined}
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              slideIndex === index
                ? 'w-10 bg-brand-accent'
                : 'w-3 bg-paper/45 hover:bg-paper/70'
            }`}
          />
        ))}
      </div>

      {!reduce && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={prev}
            className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 rounded-full border border-paper/20 bg-ink/20 px-3 py-2 text-paper/80 backdrop-blur-sm transition hover:bg-ink/35 md:inline-flex"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={next}
            className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 rounded-full border border-paper/20 bg-ink/20 px-3 py-2 text-paper/80 backdrop-blur-sm transition hover:bg-ink/35 md:inline-flex"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}

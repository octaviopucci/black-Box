'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, type RefObject } from 'react'
import { media, site, whatsappUrl } from '@/data/site'
import { useScrollVideoScrub } from '@/hooks/use-scroll-video-scrub'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function HeroCopy() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      variants={reduce ? undefined : stagger}
      initial={reduce ? false : 'hidden'}
      animate="show"
      className="max-w-4xl"
    >
      <motion.p variants={reduce ? undefined : rise} className="eyebrow text-paper/70">
        {site.specialty}
      </motion.p>

      <motion.h1
        variants={reduce ? undefined : rise}
        className="display-title mt-3 leading-[0.86] tracking-[-0.03em]"
      >
        <span className="block text-[clamp(5rem,22vw,14rem)] text-paper">Rayssa</span>
        <span className="block text-[clamp(4.25rem,18vw,11.5rem)] text-brand-accent">
          Gomes
        </span>
      </motion.h1>

      <motion.p
        variants={reduce ? undefined : rise}
        className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85 md:text-xl"
      >
        {site.headline}
      </motion.p>

      <motion.div
        variants={reduce ? undefined : rise}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <Link
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-brand-accent/90"
        >
          Agendar consulta
          <ArrowUpRight className="size-4" />
        </Link>
        <Link
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-6 py-3.5 text-sm font-medium text-paper/90 transition hover:border-paper/50 hover:text-paper"
        >
          {site.instagramHandle}
        </Link>
      </motion.div>
    </motion.div>
  )
}

function HeroMedia({
  videoRef,
  scrub,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  scrub: boolean
}) {
  const { heroVideo } = media

  return (
    <div className="absolute inset-0 bg-ink">
      <Image
        src={heroVideo.poster}
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {scrub ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={heroVideo.src}
          poster={heroVideo.poster}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-[#3d2518]/88 via-[#3d2518]/45 to-[#f2e9e1]/15" />
      <div className="absolute inset-0 bg-linear-to-r from-[#3d2518]/75 via-[#3d2518]/30 to-transparent md:from-[#3d2518]/60 md:via-[#3d2518]/20" />
    </div>
  )
}

function HeroStatic() {
  const { heroVideo } = media

  return (
    <section id="topo" className="relative min-h-svh overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 bg-ink">
        <Image
          src={heroVideo.poster}
          alt="Dra. Rayssa Alexandre Gomes"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#3d2518]/88 via-[#3d2518]/45 to-[#f2e9e1]/15" />
        <div className="absolute inset-0 bg-linear-to-r from-[#3d2518]/75 via-[#3d2518]/30 to-transparent md:from-[#3d2518]/60 md:via-[#3d2518]/20" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-6 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
        <HeroCopy />
      </div>
    </section>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrub = !reduce

  useScrollVideoScrub(sectionRef, pinRef, videoRef, {
    enabled: scrub,
    scrollLength: media.heroVideo.scrollLength,
  })

  useEffect(() => {
    if (!scrub) return
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }, [scrub])

  if (!scrub) return <HeroStatic />

  return (
    <section id="topo" ref={sectionRef} data-video-slot className="relative bg-ink text-paper">
      <div ref={pinRef} className="relative h-svh w-full overflow-hidden">
        <HeroMedia videoRef={videoRef} scrub />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
          <HeroCopy />
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-paper/35"
        >
          Role para ver
        </p>
      </div>
    </section>
  )
}

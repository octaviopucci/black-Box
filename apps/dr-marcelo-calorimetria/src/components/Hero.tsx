import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { site, bookingUrl, asset, scrubMobileFramePaths } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePreferFrameScrub } from '../hooks/usePreferFrameScrub'
import { useScrollFrameScrub, useScrollVideoScrub } from '../hooks/useScrollVideoScrub'

const headlineWords = site.headline.split(' ')
const posterDesktop = asset(site.media.scrubPoster)
const posterMobile = asset(site.media.scrubMobilePoster)
const videoSrc = asset(site.media.scrubVideo)
const scrubFrames = scrubMobileFramePaths()

function HeroCopy() {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-28 text-paper sm:px-8 sm:pb-12 md:pb-16 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-6xl pt-2 sm:pt-6"
      >
        <p className="font-display text-[clamp(1.75rem,6.5vw,3.5rem)] leading-none tracking-tight" aria-hidden>
          Calorimetria Indireta
        </p>
      </motion.div>

      <div className="mx-auto w-full max-w-6xl">
        <h1 className="sr-only">{site.examName}</h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow-light"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
          {site.specialty} · {site.crm}
        </motion.p>

        <p className="display-title mt-4 max-w-[14ch] text-[clamp(2.25rem,8.5vw,5.25rem)] leading-[0.96] sm:max-w-4xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mr-[0.28em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/78 sm:mt-6 sm:text-lg"
        >
          {site.support}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-solid justify-center sm:justify-start">
            Agendar exame
          </a>
          <a href="#como-funciona" className="cta-ghost-light justify-center sm:justify-start">
            Como funciona
            <ArrowDown className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40 sm:mt-10 sm:block"
        >
          Role para ver o analisador metabólico
        </motion.p>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/35 sm:mt-8">
          {site.examTagline}
        </p>
      </div>
    </div>
  )
}

function HeroStatic() {
  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
      <img
        src={posterDesktop}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        width={1280}
        height={720}
        fetchPriority="high"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,18,17,0.96) 0%, rgba(10,18,17,0.65) 45%, rgba(10,18,17,0.25) 100%)',
        }}
      />
      <HeroCopy />
    </section>
  )
}

export function Hero() {
  const reduced = useReducedMotion()
  const preferFrames = usePreferFrameScrub()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const scrub = !reduced
  const useFrames = preferFrames
  const posterSrc = useFrames ? posterMobile : posterDesktop

  useScrollFrameScrub(sectionRef, pinRef, canvasRef, {
    enabled: scrub && useFrames,
    frames: scrubFrames,
    scrollLength: 1.75,
    scrub: 0.12,
  })

  useScrollVideoScrub(sectionRef, pinRef, videoRef, {
    enabled: scrub && !useFrames,
    scrollLength: 2.4,
    scrub: 0.45,
  })

  if (!scrub) return <HeroStatic />

  return (
    <section
      id="topo"
      ref={sectionRef}
      data-video-slot
      className="relative bg-ink"
      aria-label="Calorimetria Indireta — apresentação do exame"
    >
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-ink">
          <img
            src={posterSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={useFrames ? 720 : 1280}
            height={useFrames ? 1280 : 720}
            fetchPriority="high"
          />

          {useFrames ? (
            <canvas
              ref={canvasRef}
              aria-hidden
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={videoSrc}
              poster={posterSrc}
              muted
              playsInline
              preload="auto"
              width={1280}
              height={720}
              aria-hidden
            />
          )}

          {useFrames && (
            <div
              className="pointer-events-none absolute inset-0 bg-black/[0.08]"
              aria-hidden
            />
          )}

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,18,17,0.96) 0%, rgba(10,18,17,0.65) 45%, rgba(10,18,17,0.2) 75%, rgba(10,18,17,0.35) 100%)',
            }}
          />
        </div>

        <HeroCopy />
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { site, bookingUrl, asset } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

const headlineWords = site.headline.split(' ')
const heroVideo = asset(site.media.heroVideo)
const heroPoster = asset(site.media.heroPoster)

function HeroOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background: [
          'linear-gradient(to top, rgba(8,14,13,0.94) 0%, rgba(8,14,13,0.78) 38%, rgba(8,14,13,0.52) 62%, rgba(8,14,13,0.38) 100%)',
          'radial-gradient(ellipse 90% 70% at 50% 100%, rgba(8,14,13,0.55), transparent 70%)',
        ].join(', '),
      }}
      aria-hidden
    />
  )
}

function HeroCopy() {
  return (
    <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-28 text-paper sm:px-8 sm:pb-12 md:pb-16 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow-light"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
          {site.specialty} · {site.crm}
        </motion.p>

        <h1 className="display-title max-w-[14ch] text-[clamp(2.25rem,8.5vw,5.25rem)] leading-[0.96] sm:max-w-4xl">
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
        </h1>

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

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/35 sm:mt-8">
          {site.examTagline}
        </p>
      </div>
    </div>
  )
}

export function Hero() {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true

    const play = () => {
      video.play().catch(() => {})
    }

    if (video.readyState >= 2) play()
    else video.addEventListener('loadeddata', play, { once: true })

    return () => {
      video.removeEventListener('loadeddata', play)
    }
  }, [reduced])

  return (
    <section
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-ink text-paper"
      aria-label="Calorimetria Indireta — apresentação do exame"
    >
      <div className="absolute inset-0">
        {reduced ? (
          <img
            src={heroPoster}
            alt=""
            className="h-full w-full object-cover object-center"
            width={1280}
            height={720}
            fetchPriority="high"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            src={heroVideo}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            width={1280}
            height={720}
            aria-hidden
          />
        )}
      </div>

      <HeroOverlay />
      <HeroCopy />
    </section>
  )
}

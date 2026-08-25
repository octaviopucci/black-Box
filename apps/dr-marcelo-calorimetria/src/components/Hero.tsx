import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import { site, bookingUrl, asset } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const headlineWords = site.headline.split(' ')
const videoSrc = asset(site.media.scrubVideo)
const posterSrc = asset(site.media.scrubPoster)

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reduced) return

    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    let trigger: ScrollTrigger | undefined

    const bindScrub = () => {
      trigger?.kill()
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          if (!video.duration || !Number.isFinite(video.duration)) return
          const target = self.progress * video.duration
          if (Math.abs(video.currentTime - target) > 0.04) {
            video.currentTime = target
          }
        },
      })
    }

    const onReady = () => {
      video.pause()
      video.currentTime = 0
      bindScrub()
      ScrollTrigger.refresh()
    }

    if (video.readyState >= 1) onReady()
    else video.addEventListener('loadedmetadata', onReady, { once: true })

    return () => {
      trigger?.kill()
      video.removeEventListener('loadedmetadata', onReady)
    }
  }, [reduced])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative h-[240vh] bg-ink sm:h-[280vh] lg:h-[320vh]"
      aria-label="Calorimetria Indireta — apresentação do exame"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {reduced ? (
          <img
            src={posterSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1280}
            height={720}
            fetchPriority="high"
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

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,18,17,0.96) 0%, rgba(10,18,17,0.72) 42%, rgba(10,18,17,0.35) 72%, rgba(10,18,17,0.5) 100%)',
          }}
        />

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

            {!reduced && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="mt-8 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40 sm:mt-10 sm:block"
              >
                Role para ver o analisador metabólico
              </motion.p>
            )}

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/35 sm:mt-8">
              {site.examTagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

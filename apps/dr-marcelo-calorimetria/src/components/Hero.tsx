import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { site, bookingUrl, asset } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollVideoScrub } from '../hooks/useScrollVideoScrub'

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
    <div className="hero-copy relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-28 text-paper sm:px-8 sm:pb-12 md:pb-16 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <p className="hero-fade eyebrow-light">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
          {site.specialty} · {site.crm}
        </p>

        <h1 className="display-title max-w-[14ch] text-[clamp(2.25rem,8.5vw,5.25rem)] leading-[0.96] sm:max-w-4xl">
          {headlineWords.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="hero-fade mr-[0.28em] inline-block"
              style={{ animationDelay: `${0.12 + i * 0.05}s` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-fade mt-5 max-w-md text-[15px] leading-relaxed text-paper/78 sm:mt-6 sm:text-lg" style={{ animationDelay: '0.55s' }}>
          {site.support}
        </p>

        <div
          className="hero-fade mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          style={{ animationDelay: '0.68s' }}
        >
          <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-solid justify-center sm:justify-start">
            Agendar exame
          </a>
          <a href="#como-funciona" className="cta-ghost-light justify-center sm:justify-start">
            Como funciona
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <p
          className="hero-fade mt-8 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40 sm:mt-10 sm:block"
          style={{ animationDelay: '1.1s' }}
        >
          Role para ver o analisador metabólico
        </p>

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
        src={heroPoster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
      />
      <HeroOverlay />
      <HeroCopy />
    </section>
  )
}

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const scrub = !reduced

  useScrollVideoScrub(sectionRef, pinRef, videoRef, {
    enabled: scrub,
    videoSrc: heroVideo,
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
            src={heroPoster}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
          />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            poster={heroPoster}
            muted
            playsInline
            preload="none"
            width={1280}
            height={720}
            aria-hidden
          />
          <HeroOverlay />
        </div>
        <HeroCopy />
      </div>
    </section>
  )
}

import { useEffect, useRef, type RefObject } from 'react'
import { asset, heroVideo, site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'
import { useScrollVideoScrub } from '../hooks/useScrollVideoScrub'
import { Reveal } from './Reveal'

function HeroStatic() {
  return (
    <section id="topo" className="overflow-hidden pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="lg:hidden">
          <div className="relative mx-auto mb-6 max-w-sm overflow-hidden rounded-2xl border border-gold/25 bg-night-lift/80 px-5 py-5 text-center backdrop-blur">
            <p className="eyebrow">{site.role}</p>
            <h1 className="display-title mt-1 text-[2.6rem]">{site.headline}</h1>
            <span className="absolute inset-x-1/3 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <div className="relative">
            <img
              src={asset(heroVideo.poster)}
              alt="Laís Felicia no Studio Laís Felicia"
              className="w-full object-cover object-center"
              fetchPriority="high"
            />
            <p className="px-1 py-5 text-center text-[15px] leading-relaxed text-white/80">{site.lead}</p>
            <div className="pb-8 text-center">
              <a href={whatsappUrl()} className="cta-gold">
                Entre em contato
              </a>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[78vh] lg:block">
          <img
            src={asset(heroVideo.poster)}
            alt="Laís Felicia no Studio Laís Felicia"
            className="h-[82vh] w-[60%] object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute left-[48%] top-1/2 z-10 w-[46%] -translate-y-1/2">
            <Reveal>
              <p className="eyebrow">{site.role}</p>
              <h1 className="display-title mt-2 text-6xl xl:text-7xl">{site.headline}</h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">{site.lead}</p>
              <div className="mt-10">
                <a href={whatsappUrl()} className="cta-gold">
                  Entre em contato
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroMedia({ videoRef, scrub }: { videoRef: RefObject<HTMLVideoElement | null>; scrub: boolean }) {
  const overlays = (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent" />
    </>
  )

  if (scrub) {
    return (
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
          src={asset(heroVideo.src)}
          poster={asset(heroVideo.poster)}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        {overlays}
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <img
        src={asset(heroVideo.poster)}
        alt="Laís Felicia no Studio Laís Felicia"
        className="h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      {overlays}
    </div>
  )
}

function HeroScrubCopy() {
  return (
    <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 sm:px-8 lg:justify-center lg:pb-24">
      <Reveal>
        <p className="eyebrow">{site.role}</p>
        <h1 className="display-title mt-3 text-[clamp(2.8rem,12vw,6.5rem)]">{site.headline}</h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">{site.lead}</p>
        <div className="mt-10">
          <a href={whatsappUrl()} className="cta-gold">
            Entre em contato
          </a>
        </div>
      </Reveal>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { reduced } = useMotion()
  const scrub = !reduced

  useScrollVideoScrub(sectionRef, videoRef, {
    enabled: scrub,
    scrollVh: heroVideo.scrollVh,
  })

  useEffect(() => {
    if (!scrub || !videoRef.current) return
    videoRef.current.pause()
  }, [scrub])

  if (!scrub) return <HeroStatic />

  return (
    <section
      id="topo"
      ref={sectionRef}
      data-video-slot
      className="relative bg-night"
      style={{ height: `${heroVideo.scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroMedia videoRef={videoRef} scrub />
        <HeroScrubCopy />
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-white/35"
        >
          Role para ver
        </p>
      </div>
    </section>
  )
}

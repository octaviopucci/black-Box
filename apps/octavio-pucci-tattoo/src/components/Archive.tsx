import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { asset, gallery, site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Archive() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - window.innerWidth

      if (scrollWidth <= 0) return

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollWidth + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="arquivo"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-parchment/5 bg-obsidian-lift"
    >
      <div className="absolute inset-0 bg-grain opacity-[0.03]" aria-hidden />

      <div className="relative flex min-h-[100svh] flex-col justify-center py-20">
        <div className="mx-auto mb-12 w-full max-w-7xl px-5 sm:px-8">
          <p className="section-label mb-3">Arquivo</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-brand text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[0.06em]">
              PELE PUBLICADA
            </h2>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost inline-flex w-fit items-center gap-2"
            >
              Ver feed completo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div ref={trackRef} className="flex w-max gap-4 px-5 sm:gap-5 sm:px-8">
          {gallery.map((item, i) => (
            <a
              key={item.id}
              href={item.permalink}
              target="_blank"
              rel="noreferrer"
              className={`group relative block shrink-0 overflow-hidden bg-ember ${
                i % 3 === 0
                  ? 'h-[min(72vh,560px)] w-[min(42vw,340px)]'
                  : i % 3 === 1
                    ? 'h-[min(62vh,480px)] w-[min(36vw,280px)] mt-12'
                    : 'h-[min(68vh,520px)] w-[min(40vw,320px)] mt-6'
              }`}
            >
              <img
                src={asset(item.image)}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-steel group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {item.caption && (
                <p className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-xs leading-relaxed text-parchment/80 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </p>
              )}
            </a>
          ))}
          <div className="flex w-[30vw] shrink-0 items-center justify-center sm:w-[18vw]">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="font-brand text-4xl tracking-[0.1em] text-parchment/20 transition-colors hover:text-copper"
            >
              @{site.instagramHandle.replace('@', '')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { archive, asset, site } from '../data/site'
import { Reveal } from './Reveal'
import { InstagramIcon } from './InstagramIcon'

gsap.registerPlugin(ScrollTrigger)

export function Archive() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      const amount = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)
      gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${amount()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
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
      className="relative overflow-hidden border-t border-line bg-ink"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 md:pb-10">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">
                <span className="h-px w-8 bg-gold" />
                Arquivo de pele
              </p>
              <h2 className="mt-5 font-brand text-[clamp(2.4rem,7vw,5rem)] leading-[0.92] tracking-[0.05em]">
                O que a agulha
                <br />
                já escreveu.
              </h2>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost w-fit"
              data-cursor
            >
              <InstagramIcon className="h-4 w-4" />
              Ver no Instagram
            </a>
          </div>
        </Reveal>
      </div>

      <div className="md:hidden space-y-4 px-5 pb-16">
        {archive.map((piece) => (
          <figure key={piece.id} className="overflow-hidden border border-line">
            <img
              src={asset(piece.image)}
              alt={piece.title}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="border-t border-line px-4 py-3">
              <p className="font-display text-xl text-bone">{piece.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ash">
                {piece.meta}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="hidden overflow-hidden pb-20 md:block">
        <div ref={trackRef} className="skin-track gap-5 px-8">
          {archive.map((piece) => (
            <figure
              key={piece.id}
              className={`group relative shrink-0 overflow-hidden border border-line ${
                piece.span === 'tall'
                  ? 'h-[70vh] w-[min(42vw,420px)]'
                  : 'h-[70vh] w-[min(48vw,480px)]'
              }`}
            >
              <img
                src={asset(piece.image)}
                alt={piece.title}
                className="h-full w-full object-cover transition duration-700 ease-ink group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-90" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-2xl text-bone">{piece.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
                  {piece.meta}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

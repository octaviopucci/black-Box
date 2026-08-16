import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { carePaths } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

/** Horizontal corridor of care — pinned scroll, architectural panels (not a card grid). */
export function Corridor() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="corredor" ref={sectionRef} className="relative scroll-mt-24 bg-void">
      <div className="px-5 pb-4 pt-20 sm:px-8 md:pl-28 md:pt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
          Corredor de cuidado
        </p>
        <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] text-paper">
          Cinco caminhos. Uma mesma conexão.
        </h2>
        <p className="mt-3 max-w-lg text-sm text-mute md:text-base">
          Deslize pelo corredor — cada especialidade é um momento contínuo.
        </p>
      </div>

      <div className="overflow-x-auto md:overflow-hidden">
        <div
          ref={trackRef}
          className="corridor-track gap-3 px-5 pb-20 pt-8 sm:px-8 md:gap-4 md:pl-28"
        >
          {carePaths.map((path, i) => (
            <Link
              key={path.id}
              to={`/cuidado/${path.id}`}
              data-cursor="hover"
              className="group relative block h-[62vh] min-h-[400px] w-[85vw] max-w-[520px] shrink-0 overflow-hidden md:h-[68vh] md:w-[42vw]"
            >
              <img
                src={path.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
                  {path.title}
                </h3>
                <p className="mt-2 text-sm text-paper/70">{path.line}</p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/55 transition duration-500 md:opacity-80 md:group-hover:opacity-100">
                  {path.detail}
                </p>
              </div>
            </Link>
          ))}
          <div className="w-6 shrink-0 md:w-20" aria-hidden />
        </div>
      </div>
    </section>
  )
}

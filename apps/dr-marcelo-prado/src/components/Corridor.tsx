import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { carePaths } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Corridor() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(1)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(
              carePaths.length,
              Math.max(1, Math.round(self.progress * (carePaths.length - 1)) + 1),
            )
            setIndex(i)
          },
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
      <div className="flex items-end justify-between gap-6 px-5 pb-8 pt-24 sm:px-8 md:pl-28 md:pt-28">
        <div>
          <p className="section-kicker">Corredor de cuidado</p>
          <h2 className="section-title mt-4 max-w-xl text-[clamp(2.1rem,5.2vw,3.6rem)]">
            Cinco eixos. Uma mesma calibração.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-mute md:text-base">
            Um percurso horizontal — cada eixo é um momento clínico, não um cartão de serviço.
          </p>
        </div>
        <p className="hidden font-display text-4xl text-signal/80 md:block" aria-live="polite">
          {String(index).padStart(2, '0')}
          <span className="text-paper/25">/{String(carePaths.length).padStart(2, '0')}</span>
        </p>
      </div>

      <div className="overflow-x-auto md:overflow-hidden">
        <div ref={trackRef} className="corridor-track gap-0 px-0 pb-28 md:pl-28">
          {carePaths.map((path, i) => (
            <Link
              key={path.id}
              to={`/cuidado/${path.id}`}
              data-cursor="hover"
              className="group relative block h-[62vh] min-h-[400px] w-[86vw] max-w-[480px] shrink-0 overflow-hidden border-y border-r border-paper/10 first:border-l md:h-[66vh] md:w-[38vw]"
            >
              <img
                src={path.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 ease-silk group-hover:scale-[1.04] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/10" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-signal">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-[clamp(2.4rem,4vw,3.4rem)] font-semibold tracking-tight text-paper">
                  {path.title}
                </h3>
                <p className="mt-2 text-sm text-champagne/80">{path.line}</p>
                <p className="mt-4 max-w-sm translate-y-2 text-sm leading-relaxed text-paper/55 opacity-0 transition duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                  {path.detail}
                </p>
              </div>
            </Link>
          ))}
          <div className="w-10 shrink-0 md:w-28" aria-hidden />
        </div>
      </div>
    </section>
  )
}

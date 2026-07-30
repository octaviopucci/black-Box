import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VehicleTile } from './VehicleTile'
import { availableVehicles } from '../data/vehicles'

gsap.registerPlugin(ScrollTrigger)

export function Garage() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 80)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(track, { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="estoque"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-line bg-ink"
      aria-labelledby="estoque-title"
    >
      <h2 id="estoque-title" className="sr-only">
        Estoque disponível — {availableVehicles.length} veículos
      </h2>

      {/* Mobile stack */}
      <div className="grid gap-5 px-6 pb-24 pt-24 sm:px-10 sm:pt-28 md:hidden">
        {availableVehicles.map((vehicle, index) => (
          <VehicleTile key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </div>

      {/* Desktop cinematic corridor */}
      <div className="hidden pb-28 pt-28 mask-fade-x md:block">
        <div ref={trackRef} className="garage-track gap-6 px-10">
          {availableVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="w-[min(78vw,420px)] shrink-0"
            >
              <VehicleTile vehicle={vehicle} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

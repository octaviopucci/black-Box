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
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:px-10 sm:pt-28">
        <p className="eyebrow mb-4">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          Estoque da loja
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2
              id="estoque-title"
              className="display text-[clamp(2.2rem,5vw,3.6rem)] text-paper-soft"
            >
              Disponíveis agora
            </h2>
            <p className="mt-4 max-w-xl text-paper/70">
              No celular, role a lista. No desktop, a página vira um corredor
              horizontal pelo estoque — com preço e opcionais de cada unidade.
            </p>
          </div>
          <p className="plaque">{availableVehicles.length} unidades</p>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="mt-12 grid gap-5 px-6 pb-24 sm:px-10 md:hidden">
        {availableVehicles.map((vehicle, index) => (
          <VehicleTile key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </div>

      {/* Desktop cinematic corridor */}
      <div className="mt-12 hidden pb-28 mask-fade-x md:block">
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

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VehicleTile } from './VehicleTile'
import { soldVehicles } from '../data/vehicles'

gsap.registerPlugin(ScrollTrigger)

export function Entregas() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-delivery]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            once: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="entregas"
      ref={ref}
      className="relative border-b border-line bg-ink-lift/50 px-6 py-24 sm:px-10 sm:py-28"
      aria-labelledby="entregas-title"
    >
      <div className="mx-auto max-w-7xl">
        <p data-delivery className="eyebrow mb-4">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          Quem já levou
        </p>
        <h2
          data-delivery
          id="entregas-title"
          className="display max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] text-paper-soft"
        >
          Entregas recentes
        </h2>
        <p data-delivery className="mt-4 max-w-2xl text-paper/70">
          Cada post de entrega é de cliente real — com nome, carro e a mesma
          loja que você encontra no mapa.
        </p>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {soldVehicles.slice(0, 9).map((vehicle, index) => (
            <div
              key={vehicle.id}
              data-delivery
              className="mb-5 break-inside-avoid"
              style={{
                transform:
                  index % 3 === 1
                    ? 'rotate(-0.6deg)'
                    : index % 3 === 2
                      ? 'rotate(0.7deg)'
                      : 'none',
              }}
            >
              <VehicleTile vehicle={vehicle} index={index} variant="delivery" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

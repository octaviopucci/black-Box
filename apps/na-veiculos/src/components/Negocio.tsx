import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site, whatsappHref } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Negocio() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-deal]',
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
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
      id="como-comprar"
      ref={ref}
      className="relative border-b border-line px-6 py-24 sm:px-10 sm:py-28"
      aria-labelledby="como-title"
    >
      <div className="mx-auto max-w-7xl">
        <p data-deal className="eyebrow mb-4">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          Como comprar
        </p>
        <h2
          data-deal
          id="como-title"
          className="display max-w-3xl text-[clamp(2.2rem,5vw,3.4rem)] text-paper-soft"
        >
          Quatro jeitos de fechar com a NA
        </h2>

        <ol className="mt-14 divide-y divide-line border border-line">
          {site.services.map((service, index) => (
            <li
              key={service.id}
              data-deal
              className="grid gap-4 p-6 transition duration-500 hover:bg-ink-lift/60 sm:grid-cols-[5rem_1fr] sm:items-start sm:gap-10 sm:p-8"
            >
              <span className="font-mono text-sm text-lamp">0{index + 1}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-paper-soft">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-paper/70">
                  {service.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div data-deal className="mt-10">
          <a
            href={whatsappHref(
              'Olá! Quero simular financiamento / troca na NA Veículos.',
            )}
            target="_blank"
            rel="noreferrer"
            className="cta-lamp"
            data-cursor="Simular"
          >
            Simular no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

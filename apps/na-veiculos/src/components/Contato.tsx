import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageCircle } from 'lucide-react'
import { InstagramIcon } from './InstagramIcon'
import { site, whatsappHref } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Contato() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-falar]',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            once: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="falar"
      ref={ref}
      className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="falar-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lamp/15 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <p data-falar className="eyebrow mb-4">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          Próximo passo
        </p>
        <h2
          data-falar
          id="falar-title"
          className="display max-w-4xl text-[clamp(2.4rem,7vw,4.8rem)] text-paper-soft"
        >
          Achou o carro? Chama a gente.
        </h2>
        <p data-falar className="mt-6 max-w-2xl text-lg text-paper/75">
          Diz o modelo no WhatsApp — respondemos com disponibilidade, simulação
          e o que precisar para fechar com segurança.
        </p>

        <div data-falar className="mt-12 flex flex-wrap gap-3">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="cta-lamp min-w-[220px]"
            data-cursor="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {site.whatsapp.label}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost"
            data-cursor="Instagram"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Truths() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-truth]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 72%',
            once: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      className="relative border-b border-line px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="truths-title"
    >
      <div className="mx-auto max-w-7xl">
        <p data-truth className="eyebrow mb-5">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          Sem enrolação
        </p>
        <h2
          data-truth
          id="truths-title"
          className="display max-w-3xl text-[clamp(2rem,4.8vw,3.4rem)] text-paper-soft"
        >
          {site.tagline}
        </h2>
        <p data-truth className="mt-5 max-w-2xl text-lg text-paper/70">
          A NA é loja física em Capão Bonito. Você escolhe o carro no estoque,
          tira as dúvidas no WhatsApp e, se quiser, vem ver pessoalmente antes
          de fechar.
        </p>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {site.truths.map((item, i) => (
            <article
              key={item.title}
              data-truth
              className="group relative overflow-hidden border border-line bg-ink-lift/60 p-7 transition duration-500 hover:border-lamp/40 sm:p-8"
            >
              <span className="font-mono text-[11px] text-lamp">
                0{i + 1}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-paper-soft">
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-paper/70">{item.text}</p>
              <span
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-lamp/10 blur-2xl transition duration-700 group-hover:bg-lamp/20"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

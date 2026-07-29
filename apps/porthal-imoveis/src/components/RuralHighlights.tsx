import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPropertyBySlug, highlights } from '../data/properties'
import { cleanTitle } from '../lib/filters'
import { Reveal } from './Reveal'

gsap.registerPlugin(ScrollTrigger)

export function RuralHighlights() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const images = stage.querySelectorAll<HTMLElement>('[data-parallax]')
    const ctx = gsap.context(() => {
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { yPercent: i % 2 === 0 ? -6 : 8 },
          {
            yPercent: i % 2 === 0 ? 8 : -6,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, stage)
    return () => ctx.revert()
  }, [])

  return (
    <section id="destaques" className="scroll-mt-28 overflow-hidden bg-forest py-20 text-white sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Campo & natureza
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
              Sítios e chácaras
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Refúgios com espaço, água e horizonte. Selecionamos oportunidades rurais para quem
              busca patrimônio com vivência — e valorização no tempo.
            </p>
          </div>
        </Reveal>

        <div ref={stageRef} className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-5">
          {highlights.map((item, index) => {
            const property = item.slug ? getPropertyBySlug(item.slug) : undefined
            const href = item.slug ? `/imovel/${encodeURIComponent(item.slug)}` : '/imoveis?kind=Sítio'
            const span =
              index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-12'

            return (
              <Reveal key={`${item.title}-${index}`} delay={index * 0.08} className={span}>
                <Link
                  to={href}
                  className={`group relative block overflow-hidden ${
                    index === 2 ? 'min-h-[280px] sm:min-h-[340px]' : 'min-h-[360px] sm:min-h-[460px]'
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      data-parallax
                      src={item.image}
                      alt={cleanTitle(item.title)}
                      className="h-[120%] w-full object-cover transition duration-[1200ms] ease-cinematic group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    {property?.cashPrice ? (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                        À vista · {property.cashPrice}
                      </p>
                    ) : null}
                    <h3 className="mt-2 max-w-xl font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                      {cleanTitle(item.title)}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 line-clamp-3">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
                      Explorar
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10">
          <Link
            to="/imoveis?kind=Sítio"
            className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver todos os imóveis rurais
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

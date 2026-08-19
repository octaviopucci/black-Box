import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { portfolio } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

export function Portfolio() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return

    const track = trackRef.current
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      const getScroll = () => track.scrollWidth - window.innerWidth + 80

      gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="portfolio" ref={sectionRef} className="relative bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-16 md:px-10 md:pt-20">
        <p className="eyebrow">Projetos reais</p>
        <h2 className="display-title mt-4 max-w-lg text-[clamp(2rem,5vw,3.5rem)] text-paper">
          Do ambiente à peça exclusiva
        </h2>
      </div>

      <div
        ref={trackRef}
        className={`flex h-[100svh] items-end gap-6 px-5 pb-16 pt-40 md:gap-8 md:px-10 md:pb-20 md:pt-44 ${
          reduced ? 'flex-wrap overflow-x-auto' : 'will-change-transform'
        }`}
      >
        {portfolio.map((item, index) => (
          <article
            key={item.id}
            className="group relative shrink-0 overflow-hidden"
            style={{ width: index === 0 ? 'min(78vw, 520px)' : 'min(68vw, 420px)' }}
          >
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-wood">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 ease-atelier group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 transition group-hover:opacity-90" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-brand text-2xl font-medium text-paper md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-paper/65">
                      {item.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-brass opacity-0 transition group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-paper/35">
                  {item.source}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

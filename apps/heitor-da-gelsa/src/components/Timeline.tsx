import { useRef } from 'react'
import { timeline } from '@/data/timeline'
import { Reveal } from './Reveal'

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section id="trajetoria" className="overflow-hidden bg-graphite py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">Trajetória</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight">
            De onde vem e como atua
          </h2>
        </Reveal>

        <div
          ref={scrollRef}
          className="mt-12 flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
        >
          {timeline.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06} className="min-w-[260px] flex-1 lg:min-w-0">
              <article className="relative h-full border-t-4 border-yellow bg-white/5 p-5 backdrop-blur-sm">
                <span className="font-display text-3xl font-black text-yellow">{item.year}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="mt-4 aspect-video w-full rounded-sm object-cover opacity-80"
                    loading="lazy"
                  />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

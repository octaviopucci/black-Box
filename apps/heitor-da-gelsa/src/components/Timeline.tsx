import { timeline } from '@/data/site'
import { Reveal } from './Reveal'

export function Timeline() {
  return (
    <section id="trajetoria" className="overflow-hidden bg-graphite py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">Trajetória</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight">
            De onde vem e como atua
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-yellow/30 lg:left-1/2 lg:-translate-x-px" aria-hidden />

          <div className="space-y-10 lg:space-y-12">
            {timeline.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <article
                  className={`relative grid gap-4 pl-8 lg:grid-cols-2 lg:gap-12 lg:pl-0 ${
                    i % 2 === 0 ? 'lg:text-right' : ''
                  }`}
                >
                  <div
                    className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-yellow bg-graphite lg:left-1/2 lg:-translate-x-1/2 ${
                      i % 2 === 0 ? 'lg:col-start-1' : ''
                    }`}
                    aria-hidden
                  />

                  <div className={i % 2 === 0 ? 'lg:col-start-1 lg:pr-12' : 'lg:col-start-2 lg:pl-12'}>
                    <span className="font-display text-2xl font-black text-yellow sm:text-3xl">{item.year}</span>
                    <h3 className="mt-2 font-display text-lg font-bold sm:text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

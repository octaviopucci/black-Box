import { timeline } from '@/data/site'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function Timeline() {
  return (
    <section id="trajetoria" className="section-shell overflow-hidden bg-graphite text-white">
      <div className="section-container">
        <SectionHeader
          eyebrow="Trajetória"
          title="De onde vem e como atua"
          theme="dark"
        />

        <div className="relative mt-16">
          <div
            className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-yellow/10 via-yellow/40 to-yellow/10 lg:left-1/2 lg:-translate-x-px"
            aria-hidden
          />

          <div className="space-y-8 lg:space-y-10">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0

              return (
                <Reveal key={item.id} delay={i * 0.04}>
                  <article className="relative lg:grid lg:grid-cols-2 lg:gap-10">
                    <div
                      className={`absolute left-0 top-6 z-10 h-4 w-4 rounded-full border-2 border-yellow bg-graphite shadow-[0_0_0_4px_rgba(16,20,24,1)] lg:left-1/2 lg:-translate-x-1/2 ${
                        isLeft ? 'lg:col-span-2' : 'lg:col-span-2'
                      }`}
                      aria-hidden
                    />

                    <div className={`pl-10 lg:pl-0 ${isLeft ? 'lg:col-start-1 lg:pr-14 lg:text-right' : 'lg:col-start-2 lg:pl-14'}`}>
                      <div className="rounded-sm border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
                        <span className="font-display text-2xl font-black text-yellow sm:text-3xl">{item.year}</span>
                        <h3 className="mt-2 font-display text-lg font-bold sm:text-xl">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{item.description}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

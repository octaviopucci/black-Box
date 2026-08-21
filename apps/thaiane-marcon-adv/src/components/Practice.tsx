import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Practice() {
  return (
    <section id="atuacao" className="bg-sheet px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold tracking-mark text-accent uppercase">Atuação</p>
          <h2 className="mt-4 max-w-measure font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-ink">
            {site.practiceHeading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {site.practice.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.1}>
              <article className="flex h-full flex-col bg-sheet px-6 py-10 md:px-8">
                <span className="font-display text-4xl leading-none text-accent/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-display text-2xl leading-tight text-ink">{item.title}</h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-mute">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

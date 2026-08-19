import { site } from '@/data/site'
import { Reveal } from './Reveal'

export function Presence() {
  return (
    <section className="border-t border-ink/8 bg-paper-lift px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Experiência</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
            Um espaço limpo, receptivo e feito para você se sentir à vontade.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {site.experience.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <li className="group">
                <span className="block h-px w-10 bg-sage transition-all duration-500 ease-tactile group-hover:w-16" />
                <p className="mt-6 text-xl leading-snug text-ink md:text-2xl">{item.line}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-mute">{item.source}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

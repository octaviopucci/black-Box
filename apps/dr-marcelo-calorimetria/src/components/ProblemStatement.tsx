import { problemLines, site, asset } from '../data/site'
import { HarrisBenedictStatic } from './HarrisBenedictStatic'

const vsMontage = asset(site.media.vsMontage)

export function ProblemStatement() {
  return (
    <section className="relative bg-paper px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">O problema</p>

        <div className="mt-4 space-y-2">
          {problemLines.map((item) => (
            <p
              key={item.line}
              className={
                item.emphasis
                  ? 'display-title text-[clamp(1.9rem,4.4vw,3.1rem)] text-ink'
                  : 'font-display text-[clamp(1.4rem,3vw,2.1rem)] text-mute'
              }
            >
              {item.line}
            </p>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-sm bg-ink shadow-lift">
          <img
            src={vsMontage}
            alt="Calculadora versus analisador metabólico portátil"
            className="block w-full"
            width={1376}
            height={768}
            loading="lazy"
            decoding="async"
          />
        </div>

        <HarrisBenedictStatic />
      </div>
    </section>
  )
}

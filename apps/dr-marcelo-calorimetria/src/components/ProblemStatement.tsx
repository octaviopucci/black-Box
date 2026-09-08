import { harrisBenedict } from '../data/harrisBenedict'
import { problemLines, site, asset } from '../data/site'

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

        <div className="mt-14 rounded-sm border border-ink/10 bg-paper-deep px-6 py-8 sm:px-8">
          <p className="font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-snug text-ink">
            {harrisBenedict.doubt.headline}
          </p>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-mute">
            {harrisBenedict.doubt.body.map((block, i) => (
              <p key={i}>
                {block.text}
                {'emphasis' in block && block.emphasis ? (
                  <span className="font-medium text-ink">{block.emphasis}</span>
                ) : null}
                {'suffix' in block ? block.suffix : null}
                {'emphasis2' in block && block.emphasis2 ? (
                  <span className="font-medium text-ink">{block.emphasis2}</span>
                ) : null}
                {'suffix2' in block ? block.suffix2 : null}
              </p>
            ))}
          </div>
          <p className="mt-5 font-display text-lg text-teal-soft">{harrisBenedict.doubt.closing}</p>
        </div>
      </div>
    </section>
  )
}

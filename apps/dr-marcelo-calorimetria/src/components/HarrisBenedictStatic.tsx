import { formatHarrisExample, harrisBenedict } from '../data/harrisBenedict'

const example = formatHarrisExample()

export function HarrisBenedictStatic() {
  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-sm border border-ink/10 bg-paper-deep px-6 py-8 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal-soft">
          Experimente a fórmula
        </p>
        <h3 className="mt-2 font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-snug text-ink">
          {harrisBenedict.title}
        </h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mute">{harrisBenedict.intro}</p>

        <div className="mt-8 space-y-4">
          <div className="rounded border border-ink/10 bg-paper px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {harrisBenedict.male.label}
            </p>
            <p className="mt-2 font-mono text-[14px] leading-relaxed text-ink">{harrisBenedict.male.formula}</p>
          </div>
          <div className="rounded border border-ink/10 bg-paper px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {harrisBenedict.female.label}
            </p>
            <p className="mt-2 font-mono text-[14px] leading-relaxed text-ink">{harrisBenedict.female.formula}</p>
          </div>
        </div>

        <div className="mt-6 rounded border border-ember/20 bg-paper px-4 py-5 sm:px-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Exemplo ilustrativo</p>
          <p className="mt-2 text-sm text-mute">{example.profile}</p>
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-ink/85">{example.expansion}</p>
          <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-ember sm:text-4xl">
            {example.breakdown.total}
            <span className="ml-2 text-sm font-normal text-mute">kcal/dia</span>
          </p>
        </div>

        <p className="mt-6 rounded border border-teal-bright/20 bg-teal-mist px-4 py-3 text-sm leading-relaxed text-ink/85">
          {harrisBenedict.footnote}
        </p>
      </div>

      <div className="rounded-sm border border-ink/10 bg-paper-deep px-6 py-8 sm:px-8">
        <p className="font-display text-[clamp(1.35rem,3.2vw,1.75rem)] leading-snug text-ink">
          {harrisBenedict.doubt.headline}
        </p>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-mute">
          {harrisBenedict.doubt.body.map((block) => (
            <p key={block.text.slice(0, 24)}>
              {block.text}
              {'emphasis' in block && block.emphasis ? (
                <span className="font-semibold uppercase tracking-wide text-teal-soft">{block.emphasis}</span>
              ) : null}
              {'suffix' in block ? block.suffix : null}
              {'emphasis2' in block && block.emphasis2 ? (
                <span className="font-semibold uppercase tracking-wide text-teal-soft">{block.emphasis2}</span>
              ) : null}
              {'suffix2' in block ? block.suffix2 : null}
            </p>
          ))}
        </div>
        <p className="mt-5 font-display text-lg text-ember sm:text-xl">{harrisBenedict.doubt.closing}</p>
      </div>
    </div>
  )
}

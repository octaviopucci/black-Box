import { Calculator } from 'lucide-react'
import { formatHarrisExample, harrisBenedict } from '../data/harrisBenedict'

const example = formatHarrisExample()

export function HarrisBenedictStatic() {
  return (
    <div className="mt-14 overflow-hidden rounded-md border border-ink/10 bg-ink text-paper shadow-lift">
      <div className="border-b border-paper/10 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-teal-bright" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal-bright">
              Experimente a fórmula
            </p>
            <h3 className="mt-1 font-display text-[clamp(1.35rem,3vw,1.65rem)] leading-snug">{harrisBenedict.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/72">{harrisBenedict.intro}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded border border-paper/10 bg-paper/[0.03] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{harrisBenedict.male.label}</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-paper/85">{harrisBenedict.male.formula}</p>
          </div>
          <div className="rounded border border-paper/10 bg-paper/[0.03] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">
              {harrisBenedict.female.label}
            </p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-paper/85">{harrisBenedict.female.formula}</p>
          </div>
        </div>

        <div className="rounded border border-paper/10 bg-paper/[0.03] px-4 py-4 sm:px-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">Exemplo ilustrativo</p>
          <p className="mt-2 text-sm text-paper/65">{example.profile}</p>
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-paper/80">{example.expansion}</p>
          <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-ember sm:text-4xl">
            {example.breakdown.total}
            <span className="ml-2 text-sm font-normal text-paper/50">kcal/dia</span>
          </p>
        </div>

        <p className="rounded border border-teal-bright/25 bg-teal-mist px-4 py-3 text-sm leading-relaxed text-paper/82">
          {harrisBenedict.footnote}
        </p>
      </div>

      <div className="border-t border-paper/10 bg-ink-soft/40 px-5 py-6 sm:px-7 sm:py-7">
        <p className="font-display text-[clamp(1.35rem,3.2vw,1.75rem)] leading-snug text-paper">
          {harrisBenedict.doubt.headline}
        </p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-paper/75 sm:text-[15px]">
          {harrisBenedict.doubt.body.map((block) => (
            <p key={block.text.slice(0, 24)}>
              {block.text}
              {'emphasis' in block && block.emphasis ? (
                <span className="font-semibold uppercase tracking-wide text-teal-bright">{block.emphasis}</span>
              ) : null}
              {'suffix' in block ? block.suffix : null}
              {'emphasis2' in block && block.emphasis2 ? (
                <span className="font-semibold uppercase tracking-wide text-teal-bright">{block.emphasis2}</span>
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

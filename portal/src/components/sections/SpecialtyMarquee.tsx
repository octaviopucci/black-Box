import { specialties } from '../../data/content'

export function SpecialtyMarquee() {
  const track = (prefix: string, hidden?: boolean) =>
    specialties.map((item, i) => (
      <span key={`${prefix}-${item}-${i}`} className="inline-flex items-center" aria-hidden={hidden || undefined}>
        <span className="px-4 text-silver">{item}</span>
        <span className="text-white/20" aria-hidden="true">
          /
        </span>
      </span>
    ))

  return (
    <section aria-label="Especialidades" className="relative overflow-hidden border-y border-white/10 py-5">
      <div className="bb-marquee font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
        {track('a')}
        {track('b', true)}
      </div>
    </section>
  )
}

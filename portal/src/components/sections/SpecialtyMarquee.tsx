import { specialties } from '../../data/content'

export function SpecialtyMarquee() {
  const items = [...specialties, ...specialties]

  return (
    <section aria-label="Especialidades" className="relative border-y border-white/10 py-5 overflow-hidden">
      <div className="bb-marquee font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center">
            <span className="px-4 text-silver">{item}</span>
            <span className="text-white/20" aria-hidden="true">
              /
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

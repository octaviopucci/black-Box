import { site, asset } from '../data/site'

export function AboutDoctor() {
  return (
    <section className="relative bg-paper px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div className="relative w-full max-w-sm overflow-hidden rounded-sm">
          <img
            src={asset('doctor-portrait.jpg')}
            alt={site.name}
            className="block w-full"
            width={900}
            height={1009}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div>
          <p className="eyebrow">Quem interpreta o exame</p>
          <h2 className="display-title max-w-md text-[clamp(1.9rem,3.6vw,2.6rem)] text-ink">{site.name}</h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-teal-soft">
            {site.specialty} · {site.crm}
          </p>

          <div className="mt-6 space-y-4">
            {site.about.map((paragraph, i) => (
              <p key={i} className="max-w-lg text-[15px] leading-relaxed text-mute">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

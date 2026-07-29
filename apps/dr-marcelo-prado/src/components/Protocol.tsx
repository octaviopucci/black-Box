import { asset, site } from '../data/site'

export function Protocol() {
  return (
    <section id="harmonie" className="relative scroll-mt-24 overflow-hidden bg-void py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-12 md:pl-28">
        <div className="md:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
            {site.protocolo.line}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-paper">
            {site.protocolo.title}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/60 sm:text-lg">
            {site.protocolo.detail}
          </p>
          <ul className="mt-8 space-y-3">
            {site.protocolo.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-paper/70">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-champagne/80">{site.korpen.title}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/45">
            {site.korpen.description}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] md:col-span-6">
          <img
            src={asset('protocolo.jpg')}
            alt={site.protocolo.title}
            loading="lazy"
            className="aspect-[5/4] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}

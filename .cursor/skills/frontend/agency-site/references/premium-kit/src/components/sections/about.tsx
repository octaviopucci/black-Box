import { siteConfig } from '@/site.config'

export function About() {
  const { about } = siteConfig
  return (
    <section id="sobre" className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-eyebrow text-accent">{about.eyebrow}</p>
          <h2 className="text-section mt-4 font-bold text-ink">{about.title}</h2>
          <p className="mt-6 text-mute">{about.body}</p>
          <div className="mt-8 flex items-end gap-2">
            <span className="text-7xl font-bold text-accent">{about.stat.value}</span>
            <div className="pb-2 text-mute">
              <span className="block font-semibold text-ink">{about.stat.unit}</span>
              {about.stat.label}
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {about.pills.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-ink/10 bg-surface px-4 py-1.5 text-sm text-ink"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-surface text-sm text-mute">
          Foto local → public/about.webp
        </div>
      </div>
    </section>
  )
}

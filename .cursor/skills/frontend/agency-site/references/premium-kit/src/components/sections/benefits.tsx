import { siteConfig } from '@/site.config'

export function Benefits() {
  const { benefits } = siteConfig
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow text-accent">{benefits.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">
          {benefits.title}
          <span className="block text-mute">{benefits.titleMuted}</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((item) => (
            <article key={item.title} className="rounded-2xl bg-surface p-6">
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-mute">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

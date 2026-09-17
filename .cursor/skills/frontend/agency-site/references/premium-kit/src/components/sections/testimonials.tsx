import { siteConfig } from '@/site.config'

export function Testimonials() {
  const { testimonials } = siteConfig
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow text-accent">{testimonials.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">{testimonials.title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t) => (
            <blockquote
              key={t.quote}
              className="rounded-2xl bg-surface p-6"
            >
              <p className="text-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-mute">{t.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

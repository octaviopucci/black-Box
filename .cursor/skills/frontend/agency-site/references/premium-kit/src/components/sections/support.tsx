import Link from 'next/link'
import { siteConfig } from '@/site.config'

export function Support() {
  const { support } = siteConfig
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow text-accent">{support.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">{support.title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {support.links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="rounded-2xl border border-ink/10 bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="font-semibold text-ink">{link.title}</h3>
              <p className="mt-2 text-sm text-mute">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

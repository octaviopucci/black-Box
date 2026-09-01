import { siteConfig } from '@/site.config'

export function Statement() {
  const { statement } = siteConfig
  return (
    <section className="notch-top relative overflow-hidden bg-accent py-24 text-center text-white md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-eyebrow text-white/80">{statement.brand}</p>
        <p className="text-section mt-4 font-bold">{statement.line}</p>
      </div>
    </section>
  )
}

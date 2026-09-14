import Link from 'next/link'
import { siteConfig } from '@/site.config'

export function Pricing() {
  const { pricing } = siteConfig
  return (
    <section id="planos" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow text-accent">{pricing.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">{pricing.title}</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl bg-paper p-8 shadow-sm transition-transform hover:-translate-y-1 ${
                plan.highlighted ? 'ring-2 ring-accent' : ''
              }`}
            >
              {'badge' in plan && plan.badge && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-2 text-sm text-mute">{plan.description}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-accent">{plan.price}</span>
                <span className="text-mute">{plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-mute">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">•</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                className={`mt-8 block rounded-xl py-3 text-center font-semibold ${
                  plan.highlighted
                    ? 'btn-shine bg-accent text-white'
                    : 'border border-ink/15 text-ink hover:bg-surface'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

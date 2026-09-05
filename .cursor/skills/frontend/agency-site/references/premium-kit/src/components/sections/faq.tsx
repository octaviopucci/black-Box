'use client'

import { siteConfig } from '@/site.config'

export function Faq() {
  const { faq } = siteConfig
  return (
    <section id="faq" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-eyebrow text-accent">{faq.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">{faq.title}</h2>
        <dl className="mt-10 space-y-4">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-ink/10 bg-paper p-5"
            >
              <summary className="cursor-pointer font-semibold text-ink">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-mute">{item.a}</p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  )
}

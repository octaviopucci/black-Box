import { energyBridgeTopics } from '../data/site'

function highlightText(body: string, highlight?: string) {
  if (!highlight) return body

  const idx = body.toLowerCase().indexOf(highlight.toLowerCase())
  if (idx === -1) {
    return (
      <>
        <span className="font-medium text-ink">{highlight.charAt(0).toUpperCase() + highlight.slice(1)}</span>
        {' — '}
        {body}
      </>
    )
  }

  const before = body.slice(0, idx)
  const match = body.slice(idx, idx + highlight.length)
  const after = body.slice(idx + highlight.length)

  return (
    <>
      {before}
      <span className="font-medium text-ink">{match}</span>
      {after}
    </>
  )
}

export function EnergyBridge() {
  return (
    <section className="relative bg-paper-deep px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <ul className="space-y-10">
          {energyBridgeTopics.map((topic) => (
            <li key={topic.lead} className="border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-teal-soft">{topic.lead}</p>
              <p className="mt-3 font-display text-[clamp(1.25rem,3vw,1.65rem)] leading-snug text-ink">
                {highlightText(topic.body, topic.highlight)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

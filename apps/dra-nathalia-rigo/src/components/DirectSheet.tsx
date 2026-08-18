import { useMemo, useState } from 'react'
import { brand, composeDirectMessage, protocolChoices } from '@/data/site'

type InterestId = (typeof protocolChoices.interest)[number]['id']
type TempoId = (typeof protocolChoices.tempo)[number]['id']

export function DirectSheet() {
  const [interest, setInterest] = useState<InterestId>(protocolChoices.interest[0].id)
  const [tempo, setTempo] = useState<TempoId>(protocolChoices.tempo[0].id)
  const [copied, setCopied] = useState(false)

  const message = useMemo(() => composeDirectMessage(interest, tempo), [interest, tempo])

  async function send() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setCopied(false)
    }
    window.open(brand.instagramDm, '_blank', 'noopener,noreferrer')
  }

  return (
    <form
      className="mx-auto max-w-xl rounded-sm border border-ink/10 bg-paper p-8 shadow-soft"
      onSubmit={(event) => {
        event.preventDefault()
        void send()
      }}
    >
      <fieldset className="space-y-3">
        <legend className="text-[11px] uppercase tracking-mark text-gold">Procedimento</legend>
        {protocolChoices.interest.map((item) => (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-3 border-b border-ink/10 py-3 ${
              interest === item.id ? 'text-ink' : 'text-mute'
            }`}
          >
            <input
              type="radio"
              name="interesse"
              checked={interest === item.id}
              onChange={() => setInterest(item.id)}
              className="accent-gold"
            />
            <span className="display text-xl">{item.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="mt-8 space-y-2">
        <legend className="text-[11px] uppercase tracking-mark text-gold">Situação</legend>
        {protocolChoices.tempo.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-3 py-2">
            <input
              type="radio"
              name="tempo"
              checked={tempo === item.id}
              onChange={() => setTempo(item.id)}
              className="accent-gold"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="mt-8 border-l-2 border-gold pl-4 text-sm leading-relaxed text-mute">{message}</p>

      <button
        type="submit"
        className="mt-8 w-full bg-gold py-4 text-[11px] font-semibold uppercase tracking-mark text-paper transition hover:bg-ink"
      >
        {copied ? 'Copiado · abrir Instagram' : brand.cta}
      </button>
    </form>
  )
}

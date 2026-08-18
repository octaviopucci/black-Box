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
      className="mx-auto max-w-2xl"
      onSubmit={(event) => {
        event.preventDefault()
        void send()
      }}
    >
      <fieldset className="space-y-4">
        <legend className="text-[11px] uppercase tracking-mark text-mute">O que te traz</legend>
        <div className="grid gap-2">
          {protocolChoices.interest.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer flex-col gap-1 border-b border-ink/10 py-4 sm:flex-row sm:items-baseline sm:justify-between ${
                interest === item.id ? 'text-ink' : 'text-mute'
              }`}
            >
              <span className="display text-2xl md:text-3xl">{item.label}</span>
              <span className="text-[11px] uppercase tracking-mark">{item.hint}</span>
              <input
                type="radio"
                name="interesse"
                value={item.id}
                checked={interest === item.id}
                onChange={() => setInterest(item.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-12 space-y-3">
        <legend className="text-[11px] uppercase tracking-mark text-mute">Como chegamos</legend>
        {protocolChoices.tempo.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-3 py-2">
            <input
              type="radio"
              name="tempo"
              value={item.id}
              checked={tempo === item.id}
              onChange={() => setTempo(item.id)}
              className="h-4 w-4 accent-cryo"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="mt-12 border-l border-cryo pl-4 text-sm leading-relaxed text-mute">{message}</p>

      <button
        type="submit"
        className="mt-10 bg-ink px-6 py-4 text-[11px] uppercase tracking-mark text-ice transition hover:bg-cryo"
      >
        {copied ? 'Mensagem copiada · abrir Instagram' : 'Copiar e abrir o direct'}
      </button>
    </form>
  )
}

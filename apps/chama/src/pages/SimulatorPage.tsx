import { useState, type FormEvent } from 'react'
import { Play, Wand2 } from 'lucide-react'
import { useChama } from '@/store/ChamaContext'

export function SimulatorPage() {
  const { state, runKeywordTrigger, simulateIncoming } = useChama()
  const [keyword, setKeyword] = useState('EU QUERO')
  const [result, setResult] = useState<string | null>(null)
  const [incoming, setIncoming] = useState('Oi, ainda tem vaga?')
  const [contactId, setContactId] = useState(state.contacts[0]?.id || '')

  function onTrigger(e: FormEvent) {
    e.preventDefault()
    const res = runKeywordTrigger(keyword)
    setResult(
      res.matched
        ? `Gatilho acionado → flow “${res.flowName}”. Veja a Inbox.`
        : 'Nenhuma automação ativa corresponde a essa palavra-chave.',
    )
  }

  function onIncoming(e: FormEvent) {
    e.preventDefault()
    if (!contactId || !incoming.trim()) return
    simulateIncoming(contactId, incoming.trim())
    setResult('Mensagem simulada enviada para a Inbox.')
    setIncoming('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
          Simulador
        </p>
        <h1 className="font-display text-3xl font-bold">Teste como no Manychat</h1>
        <p className="text-sm text-mist">
          Dispare gatilhos de keyword/comentário e simule DMs entrando na inbox.
        </p>
      </div>

      <form
        onSubmit={onTrigger}
        className="rounded-2xl border border-line bg-abyss/80 p-5"
      >
        <div className="mb-3 flex items-center gap-2 text-flame">
          <Wand2 className="h-5 w-5" />
          <h2 className="font-display text-lg font-bold text-paper">Gatilho de palavra-chave</h2>
        </div>
        <p className="mb-3 text-sm text-mist">
          Automações ativas:{" "}
          {state.automations
            .filter((a) => a.active)
            .map((a) => a.trigger)
            .join(' · ') || 'nenhuma'}
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-[200px] flex-1 rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none ring-flame focus:ring-2"
            placeholder="Digite um comentário ou keyword"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night"
          >
            <Play className="h-4 w-4" />
            Disparar
          </button>
        </div>
      </form>

      <form
        onSubmit={onIncoming}
        className="rounded-2xl border border-line bg-abyss/80 p-5"
      >
        <h2 className="font-display text-lg font-bold">Simular mensagem recebida</h2>
        <div className="mt-3 grid gap-3">
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
          >
            {state.contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.channel}
              </option>
            ))}
          </select>
          <textarea
            value={incoming}
            onChange={(e) => setIncoming(e.target.value)}
            rows={3}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
            placeholder="Texto da mensagem"
          />
          <button
            type="submit"
            className="rounded-xl border border-line py-2.5 text-sm font-bold hover:border-flame hover:text-flame"
          >
            Enviar para Inbox
          </button>
        </div>
      </form>

      {result ? (
        <div className="rounded-2xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal">
          {result}
        </div>
      ) : null}
    </div>
  )
}

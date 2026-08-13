import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { ChannelBadge, StatusPill } from '@/components/Ui'
import { uid } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'
import type { Automation, Channel } from '@/types'

export function AutomationsPage() {
  const { state, toggleAutomation, upsertAutomation } = useChama()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: '',
    trigger: '',
    type: 'keyword' as Automation['type'],
    channel: 'instagram' as Channel,
    flowId: state.flows[0]?.id || '',
  })

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.trigger.trim() || !form.flowId) return
    upsertAutomation({
      id: uid('au'),
      name: form.name.trim(),
      trigger: form.trigger.trim(),
      type: form.type,
      channel: form.channel,
      flowId: form.flowId,
      active: true,
      matches: 0,
    })
    setShow(false)
    setForm({
      name: '',
      trigger: '',
      type: 'keyword',
      channel: 'instagram',
      flowId: state.flows[0]?.id || '',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
            Automações
          </p>
          <h1 className="font-display text-3xl font-bold">Gatilhos inteligentes</h1>
          <p className="text-sm text-mist">
            Comentários, keywords, stories e boas-vindas
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night"
        >
          <Plus className="h-4 w-4" />
          Nova automação
        </button>
      </div>

      {show ? (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-2xl border border-line bg-abyss/80 p-4 md:grid-cols-2"
        >
          <input
            required
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <input
            required
            placeholder="Palavras-chave (vírgula)"
            value={form.trigger}
            onChange={(e) => setForm({ ...form, trigger: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Automation['type'] })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
          >
            {(['keyword', 'comment', 'story', 'welcome', 'sequence'] as const).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value as Channel })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
          >
            {(['instagram', 'whatsapp', 'messenger', 'telegram'] as Channel[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={form.flowId}
            onChange={(e) => setForm({ ...form, flowId: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm md:col-span-2"
          >
            {state.flows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-flame py-2.5 text-sm font-bold text-night md:col-span-2"
          >
            Criar automação
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-abyss/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-mist">
            <tr>
              <th className="px-4 py-3">Automação</th>
              <th className="hidden px-4 py-3 md:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 lg:table-cell">Canal</th>
              <th className="hidden px-4 py-3 sm:table-cell">Matches</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {state.automations.map((a) => {
              const flow = state.flows.find((f) => f.id === a.flowId)
              return (
                <tr key={a.id} className="hover:bg-slateDeep/40">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-mist">
                      {a.trigger} → {flow?.name || 'flow removido'}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 capitalize text-mist md:table-cell">{a.type}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <ChannelBadge channel={a.channel} />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {a.matches.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleAutomation(a.id)}>
                      <StatusPill status={a.active ? 'active' : 'paused'} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

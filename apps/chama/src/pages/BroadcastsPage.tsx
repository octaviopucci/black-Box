import { useState, type FormEvent } from 'react'
import { Plus, Send } from 'lucide-react'
import { ChannelBadge, StatCard, StatusPill } from '@/components/Ui'
import { formatDate, pct, uid } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'
import type { Broadcast, Channel } from '@/types'

export function BroadcastsPage() {
  const { state, upsertBroadcast, sendBroadcast } = useChama()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: '',
    message: '',
    channel: 'instagram' as Channel,
    audience: 'Todos ativos',
  })

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    const b: Broadcast = {
      id: uid('b'),
      name: form.name.trim(),
      message: form.message.trim(),
      channel: form.channel,
      audience: form.audience,
      status: 'draft',
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
    }
    upsertBroadcast(b)
    setShow(false)
    setForm({ name: '', message: '', channel: 'instagram', audience: 'Todos ativos' })
  }

  const sent = state.broadcasts.filter((b) => b.status === 'sent')
  const totalSent = sent.reduce((a, b) => a + b.stats.sent, 0)
  const totalOpened = sent.reduce((a, b) => a + b.stats.opened, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
            Broadcasts
          </p>
          <h1 className="font-display text-3xl font-bold">Campanhas em massa</h1>
        </div>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night"
        >
          <Plus className="h-4 w-4" />
          Novo broadcast
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Enviados (total)" value={totalSent.toLocaleString('pt-BR')} />
        <StatCard label="Abertura média" value={`${pct(totalOpened, totalSent)}%`} accent="text-ember" />
        <StatCard label="Campanhas" value={state.broadcasts.length} />
      </div>

      {show ? (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-2xl border border-line bg-abyss/80 p-4"
        >
          <input
            required
            placeholder="Nome da campanha"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <textarea
            required
            rows={3}
            placeholder="Mensagem"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value as Channel })}
              className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
            >
              {(['instagram', 'whatsapp', 'messenger', 'email'] as Channel[]).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              placeholder="Audiência"
              className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <button type="submit" className="rounded-xl bg-flame py-2.5 text-sm font-bold text-night">
            Salvar rascunho
          </button>
        </form>
      ) : null}

      <div className="space-y-3">
        {state.broadcasts.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-line bg-abyss/80 p-4 md:flex md:items-center md:justify-between md:gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-bold">{b.name}</h3>
                <StatusPill status={b.status} />
                <ChannelBadge channel={b.channel} />
              </div>
              <p className="mt-1 text-sm text-mist">{b.message}</p>
              <p className="mt-2 text-xs text-mist">
                Audiência: {b.audience}
                {b.sentAt ? ` · Enviado ${formatDate(b.sentAt)}` : null}
                {b.scheduledAt ? ` · Agendado ${formatDate(b.scheduledAt)}` : null}
              </p>
              {b.status === 'sent' ? (
                <p className="mt-1 text-xs text-signal">
                  {b.stats.sent} enviados · {b.stats.opened} abertos · {b.stats.clicked} cliques
                </p>
              ) : null}
            </div>
            {b.status === 'draft' || b.status === 'scheduled' ? (
              <button
                type="button"
                onClick={() => sendBroadcast(b.id)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2 text-sm font-bold text-night md:mt-0"
              >
                <Send className="h-4 w-4" />
                Enviar agora
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

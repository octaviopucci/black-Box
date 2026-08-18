import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Pause, Play, Plus, Trash2 } from 'lucide-react'
import { ChannelBadge, EmptyState, StatusPill } from '@/components/Ui'
import { formatRelative, pct, uid } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'
import type { Channel, Flow } from '@/types'

export function FlowsPage() {
  const { state, upsertFlow, deleteFlow, setFlowStatus } = useChama()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [channel, setChannel] = useState<Channel>('instagram')

  const flows = useMemo(
    () => [...state.flows].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [state.flows],
  )

  function createFlow(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const flow: Flow = {
      id: uid('f'),
      name: name.trim(),
      description: 'Novo flow criado no chama',
      channel,
      status: 'draft',
      trigger: 'Manual / personalizado',
      updatedAt: new Date().toISOString(),
      stats: { sent: 0, opened: 0, clicked: 0 },
      nodes: [
        {
          id: uid('n'),
          type: 'trigger',
          x: 40,
          y: 120,
          title: 'Gatilho',
          content: 'Início do flow',
          nextIds: [],
        },
      ],
    }
    upsertFlow(flow)
    setName('')
    setShowCreate(false)
  }

  function duplicate(flow: Flow) {
    upsertFlow({
      ...structuredClone(flow),
      id: uid('f'),
      name: `${flow.name} (cópia)`,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      stats: { sent: 0, opened: 0, clicked: 0 },
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Flows</p>
          <h1 className="font-display text-3xl font-bold">Flow Builder</h1>
          <p className="text-sm text-mist">Automações visuais no estilo Manychat</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot"
        >
          <Plus className="h-4 w-4" />
          Criar flow
        </button>
      </div>

      {showCreate ? (
        <form
          onSubmit={createFlow}
          className="flex flex-wrap gap-3 rounded-2xl border border-line bg-abyss/80 p-4"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do flow"
            className="min-w-[200px] flex-1 rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none ring-flame focus:ring-2"
          />
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
          >
            {(['instagram', 'whatsapp', 'messenger', 'telegram'] as Channel[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night">
            Criar
          </button>
        </form>
      ) : null}

      {flows.length === 0 ? (
        <EmptyState title="Nenhum flow" description="Crie seu primeiro fluxo de conversa." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {flows.map((f) => (
            <div key={f.id} className="rounded-2xl border border-line bg-abyss/80 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold">{f.name}</h3>
                  <p className="mt-1 text-xs text-mist">{f.description}</p>
                </div>
                <StatusPill status={f.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ChannelBadge channel={f.channel} />
                <span className="rounded-full bg-line/70 px-2 py-0.5 text-[10px] text-mist">
                  {f.nodes.length} nós
                </span>
              </div>
              <p className="mt-3 text-xs text-mist">
                {f.stats.sent.toLocaleString('pt-BR')} enviadas · CTR{' '}
                {pct(f.stats.clicked, f.stats.sent)}% · {formatRelative(f.updatedAt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/app/flows/${f.id}`}
                  className="rounded-lg bg-slateDeep px-3 py-1.5 text-xs font-bold hover:bg-line"
                >
                  Editar canvas
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    setFlowStatus(f.id, f.status === 'active' ? 'paused' : 'active')
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-mist hover:text-paper"
                >
                  {f.status === 'active' ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {f.status === 'active' ? 'Pausar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  onClick={() => duplicate(f)}
                  className="rounded-lg border border-line p-1.5 text-mist hover:text-paper"
                  aria-label="Duplicar"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteFlow(f.id)}
                  className="rounded-lg border border-line p-1.5 text-mist hover:text-flame"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

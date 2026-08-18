import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  Clock,
  GitBranch,
  MessageSquare,
  MousePointerClick,
  Plus,
  Save,
  Sparkles,
  Zap,
} from 'lucide-react'
import { StatusPill } from '@/components/Ui'
import { uid } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'
import type { FlowNode, FlowNodeType } from '@/types'

const palette: { type: FlowNodeType; label: string; icon: typeof Zap }[] = [
  { type: 'trigger', label: 'Gatilho', icon: Zap },
  { type: 'message', label: 'Mensagem', icon: MessageSquare },
  { type: 'buttons', label: 'Botões', icon: MousePointerClick },
  { type: 'condition', label: 'Condição', icon: GitBranch },
  { type: 'action', label: 'Ação', icon: Sparkles },
  { type: 'delay', label: 'Delay', icon: Clock },
  { type: 'ai', label: 'AI Step', icon: Bot },
]

const nodeTone: Record<FlowNodeType, string> = {
  trigger: 'border-ember/50 bg-ember/10',
  message: 'border-sky/50 bg-sky/10',
  buttons: 'border-signal/50 bg-signal/10',
  condition: 'border-mist/50 bg-mist/10',
  action: 'border-flame/50 bg-flame/10',
  delay: 'border-line bg-slateDeep',
  ai: 'border-ember/60 bg-gradient-to-br from-flame/20 to-ember/10',
}

export function FlowEditorPage() {
  const { id } = useParams()
  const { state, updateFlowNodes, setFlowStatus, upsertFlow } = useChama()
  const flow = state.flows.find((f) => f.id === id)
  const [nodes, setNodes] = useState<FlowNode[]>(() => flow?.nodes || [])
  const [selectedId, setSelectedId] = useState<string | null>(flow?.nodes[0]?.id || null)
  const [savedFlash, setSavedFlash] = useState(false)
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null)

  const selected = nodes.find((n) => n.id === selectedId)

  const connections = useMemo(() => {
    const lines: { from: FlowNode; to: FlowNode }[] = []
    nodes.forEach((n) => {
      n.nextIds.forEach((nid) => {
        const to = nodes.find((x) => x.id === nid)
        if (to) lines.push({ from: n, to })
      })
    })
    return lines
  }, [nodes])

  if (!flow) return <Navigate to="/app/flows" replace />

  const editing = flow

  function addNode(type: FlowNodeType) {
    const node: FlowNode = {
      id: uid('n'),
      type,
      x: 120 + nodes.length * 30,
      y: 80 + (nodes.length % 4) * 50,
      title: palette.find((p) => p.type === type)?.label || type,
      content:
        type === 'message'
          ? 'Escreva sua mensagem…'
          : type === 'buttons'
            ? 'Escolha uma opção'
            : type === 'delay'
              ? 'Aguardar 1 hora'
              : type === 'ai'
                ? 'Responder com IA + knowledge'
                : 'Configure este passo',
      options: type === 'buttons' ? ['Opção A', 'Opção B'] : undefined,
      nextIds: [],
    }
    setNodes((prev) => {
      const next = [...prev, node]
      if (selectedId) {
        return next.map((n) =>
          n.id === selectedId && !n.nextIds.includes(node.id)
            ? { ...n, nextIds: [...n.nextIds, node.id] }
            : n,
        )
      }
      return next
    })
    setSelectedId(node.id)
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>, node: FlowNode) {
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    dragRef.current = {
      id: node.id,
      ox: e.clientX - node.x,
      oy: e.clientY - node.y,
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return
    const { id: dragId, ox, oy } = dragRef.current
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragId
          ? { ...n, x: Math.max(0, e.clientX - ox), y: Math.max(0, e.clientY - oy) }
          : n,
      ),
    )
  }

  function onPointerUp() {
    dragRef.current = null
  }

  function save() {
    updateFlowNodes(editing.id, nodes)
    upsertFlow({ ...editing, nodes, updatedAt: new Date().toISOString() })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  function updateSelected(patch: Partial<FlowNode>) {
    if (!selectedId) return
    setNodes((prev) => prev.map((n) => (n.id === selectedId ? { ...n, ...patch } : n)))
  }

  function removeSelected() {
    if (!selectedId) return
    setNodes((prev) =>
      prev
        .filter((n) => n.id !== selectedId)
        .map((n) => ({ ...n, nextIds: n.nextIds.filter((x) => x !== selectedId) })),
    )
    setSelectedId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/app/flows"
            className="rounded-lg border border-line p-2 text-mist hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">{flow.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill status={flow.status} />
              <span className="text-xs text-mist">{flow.trigger}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setFlowStatus(flow.id, flow.status === 'active' ? 'paused' : 'active')
            }
            className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-mist hover:text-paper"
          >
            {flow.status === 'active' ? 'Pausar' : 'Ativar'}
          </button>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2 text-sm font-bold text-night hover:bg-flameHot"
          >
            <Save className="h-4 w-4" />
            {savedFlash ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[200px_1fr_280px]">
        <div className="rounded-2xl border border-line bg-abyss/80 p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-mist">
            Adicionar passo
          </p>
          <div className="space-y-1.5">
            {palette.map((p) => (
              <button
                key={p.type}
                type="button"
                onClick={() => addNode(p.type)}
                className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm hover:border-flame/40 hover:bg-slateDeep"
              >
                <p.icon className="h-4 w-4 text-flame" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="relative h-[620px] overflow-auto rounded-2xl border border-line bg-[radial-gradient(circle_at_1px_1px,#1E3244_1px,transparent_0)] bg-[length:22px_22px] bg-night"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {connections.map(({ from, to }) => (
              <path
                key={`${from.id}-${to.id}`}
                d={`M ${from.x + 140} ${from.y + 40} C ${from.x + 220} ${from.y + 40}, ${to.x - 40} ${to.y + 40}, ${to.x} ${to.y + 40}`}
                stroke="#FF5A2D55"
                strokeWidth="2"
                fill="none"
              />
            ))}
          </svg>
          {nodes.map((node) => (
            <div
              key={node.id}
              onPointerDown={(e) => {
                setSelectedId(node.id)
                onPointerDown(e, node)
              }}
              style={{ left: node.x, top: node.y }}
              className={`absolute w-[220px] cursor-grab rounded-xl border p-3 shadow-soft active:cursor-grabbing ${nodeTone[node.type]} ${
                selectedId === node.id ? 'ring-2 ring-flame' : ''
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-mist">
                {node.title}
              </p>
              <p className="mt-1 line-clamp-3 text-sm">{node.content}</p>
              {node.options?.length ? (
                <div className="mt-2 space-y-1">
                  {node.options.map((o) => (
                    <div
                      key={o}
                      className="rounded-lg bg-night/50 px-2 py-1 text-[11px] text-mist"
                    >
                      {o}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {nodes.length === 0 ? (
            <div className="grid h-full place-items-center text-mist">
              <div className="text-center">
                <Plus className="mx-auto h-8 w-8 text-flame" />
                <p className="mt-2">Adicione o primeiro nó</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-line bg-abyss/80 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-mist">Propriedades</p>
          {selected ? (
            <div className="mt-3 space-y-3">
              <label className="block text-xs text-mist">
                Título
                <input
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-line bg-night px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs text-mist">
                Conteúdo
                <textarea
                  value={selected.content}
                  onChange={(e) => updateSelected({ content: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-line bg-night px-3 py-2 text-sm outline-none"
                />
              </label>
              {selected.type === 'buttons' ? (
                <label className="block text-xs text-mist">
                  Opções (uma por linha)
                  <textarea
                    value={(selected.options || []).join('\n')}
                    onChange={(e) =>
                      updateSelected({
                        options: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-line bg-night px-3 py-2 text-sm outline-none"
                  />
                </label>
              ) : null}
              <label className="block text-xs text-mist">
                Conectar para (IDs separados por vírgula)
                <input
                  value={selected.nextIds.join(',')}
                  onChange={(e) =>
                    updateSelected({
                      nextIds: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-line bg-night px-3 py-2 text-sm outline-none"
                />
              </label>
              <p className="text-[10px] text-mist">ID: {selected.id}</p>
              <button
                type="button"
                onClick={removeSelected}
                className="w-full rounded-xl border border-flame/40 py-2 text-sm font-semibold text-flame hover:bg-flame/10"
              >
                Remover nó
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-mist">Selecione um nó no canvas.</p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Stage = {
  id: string
  name: string
  description: string | null
  position: number
}

type Pipeline = {
  id: string
  name: string
  description: string | null
  isDefault: boolean
  isActive: boolean
  stages: Stage[]
}

type PipelinesPageClientProps = {
  canCreatePipeline: boolean
  canUpdatePipeline: boolean
  canCreateStage: boolean
  canUpdateStage: boolean
}

export function PipelinesPageClient({
  canCreatePipeline,
  canUpdatePipeline,
  canCreateStage,
  canUpdateStage,
}: PipelinesPageClientProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const selected = pipelines.find((p) => p.id === selectedId) ?? pipelines[0]

  const loadPipelines = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/crm/pipelines')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load pipelines')
      const list: Pipeline[] = data.pipelines ?? []
      setPipelines(list)
      if (!selectedId && list[0]) setSelectedId(list[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pipelines')
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  useEffect(() => {
    void loadPipelines()
  }, [loadPipelines])

  async function onCreatePipeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreatePipeline) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch('/api/crm/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          description: String(form.get('description') ?? '') || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create pipeline')
      event.currentTarget.reset()
      await loadPipelines()
      if (data.pipeline?.id) setSelectedId(data.pipeline.id)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create pipeline')
    } finally {
      setSaving(false)
    }
  }

  async function onUpdatePipeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canUpdatePipeline || !selected) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/crm/pipelines/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          description: String(form.get('description') ?? '') || null,
          isDefault: form.get('isDefault') === 'on',
          isActive: form.get('isActive') === 'on',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update pipeline')
      await loadPipelines()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update pipeline')
    } finally {
      setSaving(false)
    }
  }

  async function onCreateStage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateStage || !selected) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    const position = selected.stages.length
    try {
      const res = await fetch(`/api/crm/pipelines/${selected.id}/stages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          position,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create stage')
      event.currentTarget.reset()
      await loadPipelines()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create stage')
    } finally {
      setSaving(false)
    }
  }

  async function moveStage(stageId: string, direction: 'up' | 'down') {
    if (!canUpdateStage || !selected) return
    const sorted = [...selected.stages].sort((a, b) => a.position - b.position)
    const index = sorted.findIndex((s) => s.id === stageId)
    if (index < 0) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= sorted.length) return

    const reordered = [...sorted]
    ;[reordered[index], reordered[swapIndex]] = [reordered[swapIndex]!, reordered[index]!]

    try {
      const res = await fetch(`/api/crm/pipelines/${selected.id}/stages/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageIds: reordered.map((s) => s.id) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to reorder stages')
      await loadPipelines()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reorder stages')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/app/crm" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← CRM
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Pipelines</h1>
          <p className="text-sm text-zinc-400">Configure pipelines comerciais e estágios.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState title="Carregando pipelines…" />
      ) : error ? (
        <ErrorState
          title="Não foi possível carregar pipelines"
          description={error}
          action={
            <Button variant="secondary" onClick={() => void loadPipelines()}>
              Tentar novamente
            </Button>
          }
        />
      ) : pipelines.length === 0 ? (
        <EmptyState title="Nenhum pipeline" description="Crie o primeiro pipeline comercial." />
      ) : (
        <>
          {actionError ? (
            <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              {actionError}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 lg:flex-row">
            <Card className="lg:w-64">
              <h2 className="font-medium text-zinc-100">Pipelines</h2>
              <ul className="mt-3 space-y-1">
                {pipelines.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                        selected?.id === p.id
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {p.name}
                      {!p.isActive ? ' (inativo)' : ''}
                      {p.isDefault ? ' ★' : ''}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {selected ? (
              <div className="flex-1 space-y-4">
                {canUpdatePipeline ? (
                  <Card>
                    <h2 className="font-medium text-zinc-100">Editar pipeline</h2>
                    <form
                      key={selected.id}
                      onSubmit={(e) => void onUpdatePipeline(e)}
                      className="mt-4 space-y-3"
                    >
                      <input
                        name="name"
                        defaultValue={selected.name}
                        required
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <textarea
                        name="description"
                        defaultValue={selected.description ?? ''}
                        rows={2}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input name="isDefault" type="checkbox" defaultChecked={selected.isDefault} />
                        Pipeline padrão
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input name="isActive" type="checkbox" defaultChecked={selected.isActive} />
                        Ativo
                      </label>
                      <Button type="submit" disabled={saving}>
                        Salvar pipeline
                      </Button>
                    </form>
                  </Card>
                ) : null}

                <Card>
                  <h2 className="font-medium text-zinc-100">Estágios</h2>
                  <ol className="mt-3 space-y-2">
                    {[...selected.stages]
                      .sort((a, b) => a.position - b.position)
                      .map((stage, index, arr) => (
                        <li
                          key={stage.id}
                          className="flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2 text-sm"
                        >
                          <span className="text-zinc-200">
                            {index + 1}. {stage.name}
                          </span>
                          {canUpdateStage ? (
                            <div className="flex gap-1">
                              <Button
                                variant="secondary"
                                onClick={() => void moveStage(stage.id, 'up')}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => void moveStage(stage.id, 'down')}
                                disabled={index === arr.length - 1}
                              >
                                ↓
                              </Button>
                            </div>
                          ) : null}
                        </li>
                      ))}
                  </ol>

                  {canCreateStage ? (
                    <form onSubmit={(e) => void onCreateStage(e)} className="mt-4 flex gap-2">
                      <input
                        name="name"
                        required
                        placeholder="Nome do estágio"
                        className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <Button type="submit" disabled={saving}>
                        Adicionar
                      </Button>
                    </form>
                  ) : null}
                </Card>
              </div>
            ) : null}
          </div>

          {canCreatePipeline ? (
            <Card>
              <h2 className="font-medium text-zinc-100">Novo pipeline</h2>
              <form onSubmit={(e) => void onCreatePipeline(e)} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  name="name"
                  required
                  placeholder="Nome"
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:flex-1"
                />
                <input
                  name="description"
                  placeholder="Descrição"
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:flex-1"
                />
                <Button type="submit" disabled={saving}>
                  Criar
                </Button>
              </form>
            </Card>
          ) : null}
        </>
      )}
    </div>
  )
}

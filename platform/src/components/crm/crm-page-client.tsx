'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Stage = { id: string; name: string; position: number }
type Pipeline = { id: string; name: string; isDefault: boolean; stages: Stage[] }

type Opportunity = {
  id: string
  title: string
  amount: string | null
  probability: number | null
  expectedCloseAt: string | null
  updatedAt: string
  stageId: string
  pipelineId: string
  lead?: { id: string; name: string; companyName: string | null; email: string | null }
  partner?: { id: string; name: string } | null
  pipeline?: { id: string; name: string }
  stage?: { id: string; name: string; position: number }
}

type CrmPageClientProps = {
  canCreate: boolean
  canMove: boolean
}

export function CrmPageClient({ canCreate, canMove }: CrmPageClientProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movingId, setMovingId] = useState<string | null>(null)

  const selectedPipeline = useMemo(
    () => pipelines.find((p) => p.id === selectedPipelineId) ?? pipelines[0],
    [pipelines, selectedPipelineId],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pipelineRes = await fetch('/api/crm/pipelines')
      const pipelineData = await pipelineRes.json()
      if (!pipelineRes.ok) throw new Error(pipelineData?.error?.message ?? 'Failed to load pipelines')

      const loadedPipelines: Pipeline[] = pipelineData.pipelines ?? []
      setPipelines(loadedPipelines)
      const pipelineId = selectedPipelineId || loadedPipelines[0]?.id || ''
      if (!selectedPipelineId && pipelineId) setSelectedPipelineId(pipelineId)

      const params = new URLSearchParams()
      if (pipelineId) params.set('pipelineId', pipelineId)
      if (search.trim()) params.set('search', search.trim())
      params.set('pageSize', '200')

      const oppRes = await fetch(`/api/crm/opportunities?${params.toString()}`)
      const oppData = await oppRes.json()
      if (!oppRes.ok) throw new Error(oppData?.error?.message ?? 'Failed to load opportunities')
      setOpportunities(oppData.opportunities ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CRM')
    } finally {
      setLoading(false)
    }
  }, [search, selectedPipelineId])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function moveOpportunity(opportunityId: string, stageId: string) {
    if (!canMove) return
    setMovingId(opportunityId)
    try {
      const res = await fetch(`/api/crm/opportunities/${opportunityId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to move opportunity')
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opportunityId ? { ...o, ...data.opportunity } : o)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move opportunity')
    } finally {
      setMovingId(null)
    }
  }

  function onDragStart(e: React.DragEvent, opportunityId: string) {
    e.dataTransfer.setData('text/opportunity-id', opportunityId)
  }

  function onDropStage(e: React.DragEvent, stageId: string) {
    e.preventDefault()
    const opportunityId = e.dataTransfer.getData('text/opportunity-id')
    if (opportunityId) void moveOpportunity(opportunityId, stageId)
  }

  const stages = useMemo(() => selectedPipeline?.stages ?? [], [selectedPipeline])
  const byStage = useMemo(() => {
    const map = new Map<string, Opportunity[]>()
    for (const stage of stages) map.set(stage.id, [])
    for (const opp of opportunities) {
      const list = map.get(opp.stageId)
      if (list) list.push(opp)
    }
    return map
  }, [opportunities, stages])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="text-sm text-zinc-400">Pipeline comercial — oportunidades e estágios.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={view === 'kanban' ? 'primary' : 'secondary'}
            onClick={() => setView('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={view === 'list' ? 'primary' : 'secondary'}
            onClick={() => setView('list')}
          >
            Lista
          </Button>
          {canCreate ? (
            <Link href="/app/crm/opportunities/new">
              <Button>Nova oportunidade</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selectedPipelineId || selectedPipeline?.id || ''}
          onChange={(e) => setSelectedPipelineId(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 sm:max-w-xs"
        >
          {pipelines.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.isDefault ? ' (padrão)' : ''}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Buscar título, lead, empresa, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 sm:max-w-md"
        />
        <Button variant="secondary" onClick={() => void loadData()}>
          Aplicar
        </Button>
      </div>

      {loading ? (
        <LoadingState title="Carregando CRM…" />
      ) : error ? (
        <ErrorState
          title="Não foi possível carregar o CRM"
          description={error}
          action={
            <Button variant="secondary" onClick={() => void loadData()}>
              Tentar novamente
            </Button>
          }
        />
      ) : view === 'kanban' ? (
        stages.length === 0 ? (
          <EmptyState title="Nenhum estágio" description="Configure estágios no pipeline." />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="min-w-[260px] flex-shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/40"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropStage(e, stage.id)}
              >
                <div className="border-b border-zinc-800 px-3 py-2">
                  <h2 className="text-sm font-medium text-zinc-200">{stage.name}</h2>
                  <p className="text-xs text-zinc-500">{(byStage.get(stage.id) ?? []).length} oportunidade(s)</p>
                </div>
                <div className="space-y-2 p-2">
                  {(byStage.get(stage.id) ?? []).map((opp) => (
                    <Card
                      key={opp.id}
                      draggable={canMove}
                      onDragStart={(e) => onDragStart(e, opp.id)}
                      className={`cursor-grab active:cursor-grabbing ${movingId === opp.id ? 'opacity-60' : ''}`}
                    >
                      <Link href={`/app/crm/opportunities/${opp.id}`} className="block">
                        <h3 className="font-medium text-zinc-100">{opp.title}</h3>
                        <p className="mt-1 text-xs text-zinc-400">{opp.lead?.name ?? '—'}</p>
                        {opp.partner ? (
                          <p className="text-xs text-zinc-500">Parceiro: {opp.partner.name}</p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                          {opp.amount ? <span>R$ {opp.amount}</span> : null}
                          {opp.probability != null ? <span>{opp.probability}%</span> : null}
                          {opp.expectedCloseAt ? (
                            <span>{new Date(opp.expectedCloseAt).toLocaleDateString()}</span>
                          ) : null}
                        </div>
                      </Link>
                      {canMove ? (
                        <select
                          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300"
                          value={opp.stageId}
                          onChange={(e) => void moveOpportunity(opp.id, e.target.value)}
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="Nenhuma oportunidade"
          description="Crie a primeira oportunidade a partir de um lead."
          action={
            canCreate ? (
              <Link href="/app/crm/opportunities/new">
                <Button>Criar oportunidade</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-zinc-800 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Oportunidade</th>
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Parceiro</th>
                  <th className="px-4 py-3 font-medium">Pipeline</th>
                  <th className="px-4 py-3 font-medium">Estágio</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Prob.</th>
                  <th className="px-4 py-3 font-medium">Previsão</th>
                  <th className="px-4 py-3 font-medium">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/crm/opportunities/${opp.id}`}
                        className="font-medium text-zinc-100 hover:underline"
                      >
                        {opp.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{opp.lead?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{opp.partner?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{opp.pipeline?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{opp.stage?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{opp.amount ? `R$ ${opp.amount}` : '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {opp.probability != null ? `${opp.probability}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {opp.expectedCloseAt
                        ? new Date(opp.expectedCloseAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(opp.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {opportunities.map((opp) => (
              <Link key={opp.id} href={`/app/crm/opportunities/${opp.id}`}>
                <Card className="transition hover:border-zinc-600">
                  <h2 className="font-medium text-zinc-100">{opp.title}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{opp.lead?.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>{opp.stage?.name}</span>
                    {opp.amount ? <span>· R$ {opp.amount}</span> : null}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

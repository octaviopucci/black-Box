'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

const INTERACTION_TYPES = [
  'NOTE',
  'CALL',
  'WHATSAPP',
  'EMAIL',
  'MEETING',
  'PROPOSAL',
  'OTHER',
] as const

type Opportunity = {
  id: string
  title: string
  description: string | null
  amount: string | null
  probability: number | null
  expectedCloseAt: string | null
  stageId: string
  pipelineId: string
  lead?: { id: string; name: string; companyName: string | null; email: string | null }
  partner?: { id: string; name: string } | null
  pipeline?: { id: string; name: string }
  stage?: { id: string; name: string; position: number }
}

type StageHistory = {
  id: string
  createdAt: string
  fromStage?: { id: string; name: string } | null
  toStage: { id: string; name: string }
  user?: { id: string; name: string }
}

type Interaction = {
  id: string
  type: string
  description: string
  occurredAt: string
  user?: { id: string; name: string }
}

type Stage = { id: string; name: string; position: number }

type OpportunityDetailClientProps = {
  opportunityId: string
  canUpdate: boolean
  canMove: boolean
  canCreateInteraction: boolean
}

export function OpportunityDetailClient({
  opportunityId,
  canUpdate,
  canMove,
  canCreateInteraction,
}: OpportunityDetailClientProps) {
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [oppRes, interactionsRes] = await Promise.all([
        fetch(`/api/crm/opportunities/${opportunityId}`),
        fetch(`/api/crm/opportunities/${opportunityId}/interactions`),
      ])
      const oppData = await oppRes.json()
      if (!oppRes.ok) throw new Error(oppData?.error?.message ?? 'Failed to load opportunity')
      setOpportunity(oppData.opportunity)
      setStageHistory(oppData.stageHistory ?? [])

      if (interactionsRes.ok) {
        const interactionsData = await interactionsRes.json()
        setInteractions(interactionsData.interactions ?? [])
      }

      if (oppData.opportunity?.pipelineId) {
        const pipeRes = await fetch(`/api/crm/pipelines/${oppData.opportunity.pipelineId}`)
        if (pipeRes.ok) {
          const pipeData = await pipeRes.json()
          setStages(pipeData.pipeline?.stages ?? [])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunity')
    } finally {
      setLoading(false)
    }
  }, [opportunityId])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!opportunity || !canUpdate) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/crm/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: String(form.get('title') ?? ''),
          description: String(form.get('description') ?? '') || null,
          amount: form.get('amount') ? Number(form.get('amount')) : null,
          probability: form.get('probability') ? Number(form.get('probability')) : null,
          expectedCloseAt: String(form.get('expectedCloseAt') ?? '') || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update opportunity')
      setOpportunity(data.opportunity)
      router.refresh()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  async function onMove(stageId: string) {
    if (!canMove || !opportunity) return
    setActionError(null)
    try {
      const res = await fetch(`/api/crm/opportunities/${opportunityId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to move')
      setOpportunity(data.opportunity)
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to move')
    }
  }

  async function onCreateInteraction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateInteraction) return
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/crm/opportunities/${opportunityId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: String(form.get('type') ?? 'NOTE'),
          description: String(form.get('description') ?? ''),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create interaction')
      setInteractions((prev) => [data.interaction, ...prev])
      event.currentTarget.reset()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create interaction')
    }
  }

  if (loading) return <LoadingState title="Carregando oportunidade…" />
  if (error || !opportunity) {
    return (
      <ErrorState
        title="Oportunidade não encontrada"
        description={error ?? 'Recurso indisponível'}
        action={
          <Link href="/app/crm">
            <Button variant="secondary">Voltar ao CRM</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/crm" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← CRM
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{opportunity.title}</h1>
        <p className="text-sm text-zinc-400">
          {opportunity.pipeline?.name} · {opportunity.stage?.name}
        </p>
      </div>

      {actionError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-medium text-zinc-100">Informações comerciais</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Lead</dt>
              <dd className="text-zinc-200">
                {opportunity.lead ? (
                  <Link href={`/app/leads/${opportunity.lead.id}`} className="hover:underline">
                    {opportunity.lead.name}
                  </Link>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Parceiro</dt>
              <dd className="text-zinc-200">{opportunity.partner?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Valor</dt>
              <dd className="text-zinc-200">{opportunity.amount ? `R$ ${opportunity.amount}` : '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Probabilidade</dt>
              <dd className="text-zinc-200">
                {opportunity.probability != null ? `${opportunity.probability}%` : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Previsão de fechamento</dt>
              <dd className="text-zinc-200">
                {opportunity.expectedCloseAt
                  ? new Date(opportunity.expectedCloseAt).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
          </dl>
          {opportunity.description ? (
            <p className="mt-4 text-sm text-zinc-400">{opportunity.description}</p>
          ) : null}
        </Card>

        {canUpdate ? (
          <Card>
            <h2 className="font-medium text-zinc-100">Editar</h2>
            <form onSubmit={(e) => void onSubmit(e)} className="mt-4 space-y-3">
              <input
                name="title"
                defaultValue={opportunity.title}
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <textarea
                name="description"
                defaultValue={opportunity.description ?? ''}
                rows={3}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="amount"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={opportunity.amount ?? ''}
                  placeholder="Valor"
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
                <input
                  name="probability"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={opportunity.probability ?? ''}
                  placeholder="Probabilidade %"
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
              </div>
              <input
                name="expectedCloseAt"
                type="date"
                defaultValue={
                  opportunity.expectedCloseAt
                    ? new Date(opportunity.expectedCloseAt).toISOString().slice(0, 10)
                    : ''
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar'}
              </Button>
            </form>
          </Card>
        ) : null}

        {canMove && stages.length > 0 ? (
          <Card>
            <h2 className="font-medium text-zinc-100">Mover estágio</h2>
            <select
              value={opportunity.stageId}
              onChange={(e) => void onMove(e.target.value)}
              className="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Card>
        ) : null}
      </div>

      <Card>
        <h2 className="font-medium text-zinc-100">Histórico de estágios</h2>
        {stageHistory.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Nenhuma movimentação registrada.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {stageHistory.map((h) => (
              <li key={h.id} className="flex flex-wrap gap-2 text-zinc-400">
                <span>{new Date(h.createdAt).toLocaleString()}</span>
                <span>
                  {h.fromStage?.name ?? 'Início'} → {h.toStage.name}
                </span>
                {h.user ? <span className="text-zinc-500">({h.user.name})</span> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-medium text-zinc-100">Interações comerciais</h2>
        {canCreateInteraction ? (
          <form onSubmit={(e) => void onCreateInteraction(e)} className="mt-4 space-y-3">
            <select
              name="type"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              {INTERACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Descrição da interação"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            />
            <Button type="submit">Registrar interação</Button>
          </form>
        ) : null}
        <ul className="mt-4 space-y-3">
          {interactions.map((i) => (
            <li key={i.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
              <div className="flex flex-wrap gap-2 text-zinc-500">
                <span className="font-medium text-zinc-300">{i.type}</span>
                <span>{new Date(i.occurredAt).toLocaleString()}</span>
                {i.user ? <span>· {i.user.name}</span> : null}
              </div>
              <p className="mt-2 text-zinc-300">{i.description}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

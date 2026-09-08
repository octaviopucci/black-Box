'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type Lead = { id: string; name: string; companyName: string | null }
type Pipeline = { id: string; name: string; stages: Array<{ id: string; name: string }> }

export function OpportunityCreateClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedLeadId = searchParams.get('leadId') ?? ''

  const [leads, setLeads] = useState<Lead[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedPipelineId, setSelectedPipelineId] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [leadsRes, pipesRes] = await Promise.all([
          fetch('/api/leads?pageSize=100'),
          fetch('/api/crm/pipelines'),
        ])
        const leadsData = await leadsRes.json()
        const pipesData = await pipesRes.json()
        if (!leadsRes.ok) throw new Error(leadsData?.error?.message ?? 'Failed to load leads')
        if (!pipesRes.ok) throw new Error(pipesData?.error?.message ?? 'Failed to load pipelines')
        setLeads(leadsData.leads ?? [])
        const loadedPipelines: Pipeline[] = pipesData.pipelines ?? []
        setPipelines(loadedPipelines)
        setSelectedPipelineId(loadedPipelines[0]?.id ?? '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form data')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const selectedPipeline = pipelines.find((p) => p.id === selectedPipelineId)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    const form = new FormData(event.currentTarget)
    const stageId = String(form.get('stageId') ?? '')
    try {
      const res = await fetch('/api/crm/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: String(form.get('leadId') ?? ''),
          pipelineId: selectedPipelineId || undefined,
          stageId: stageId || undefined,
          title: String(form.get('title') ?? ''),
          description: String(form.get('description') ?? '') || undefined,
          amount: form.get('amount') ? Number(form.get('amount')) : undefined,
          probability: form.get('probability') ? Number(form.get('probability')) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create opportunity')
      router.push(`/app/crm/opportunities/${data.opportunity.id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState title="Carregando formulário…" />
  if (error) {
    return (
      <ErrorState
        title="Não foi possível carregar o formulário"
        description={error}
        action={
          <Link href="/app/crm">
            <Button variant="secondary">Voltar</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/app/crm" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← CRM
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nova oportunidade</h1>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          {submitError ? (
            <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              {submitError}
            </p>
          ) : null}

          <label className="block text-sm">
            <span className="text-zinc-400">Lead *</span>
            <select
              name="leadId"
              required
              defaultValue={preselectedLeadId}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              <option value="">Selecione um lead</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.companyName ? ` (${l.companyName})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">Pipeline</span>
            <select
              value={selectedPipelineId}
              onChange={(e) => setSelectedPipelineId(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              {pipelines.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {selectedPipeline && selectedPipeline.stages.length > 0 ? (
            <label className="block text-sm">
              <span className="text-zinc-400">Estágio inicial</span>
              <select
                name="stageId"
                defaultValue={selectedPipeline.stages[0]?.id}
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              >
                {selectedPipeline.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="text-zinc-400">Título *</span>
            <input
              name="title"
              required
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">Descrição</span>
            <textarea
              name="description"
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-zinc-400">Valor</span>
              <input
                name="amount"
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Probabilidade %</span>
              <input
                name="probability"
                type="number"
                min={0}
                max={100}
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Criando…' : 'Criar oportunidade'}
            </Button>
            <Link href="/app/crm">
              <Button variant="secondary" type="button">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

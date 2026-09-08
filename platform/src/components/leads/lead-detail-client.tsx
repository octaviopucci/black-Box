'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

const INTERACTION_TYPES = ['NOTE', 'CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'OTHER'] as const

type Lead = {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  document: string | null
  source: string | null
  notes: string | null
  partner?: { id: string; name: string } | null
}

type Interaction = {
  id: string
  type: string
  description: string
  occurredAt: string
  createdBy?: { id: string; name: string }
}

type LeadDetailClientProps = {
  leadId: string
  canUpdate: boolean
  canCreateInteraction: boolean
}

export function LeadDetailClient({
  leadId,
  canUpdate,
  canCreateInteraction,
}: LeadDetailClientProps) {
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [leadRes, interactionsRes] = await Promise.all([
        fetch(`/api/leads/${leadId}`),
        fetch(`/api/leads/${leadId}/interactions`),
      ])
      const leadData = await leadRes.json()
      if (!leadRes.ok) throw new Error(leadData?.error?.message ?? 'Failed to load lead')
      setLead(leadData.lead)

      if (interactionsRes.ok) {
        const interactionsData = await interactionsRes.json()
        setInteractions(interactionsData.interactions ?? [])
      } else {
        setInteractions([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lead')
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!lead || !canUpdate) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          companyName: String(form.get('companyName') ?? '') || null,
          email: String(form.get('email') ?? '') || null,
          phone: String(form.get('phone') ?? '') || null,
          document: String(form.get('document') ?? '') || null,
          source: String(form.get('source') ?? '') || null,
          notes: String(form.get('notes') ?? '') || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update lead')
      setLead(data.lead)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update lead')
    } finally {
      setSaving(false)
    }
  }

  async function onAddInteraction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateInteraction) return
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/leads/${leadId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: String(form.get('type') ?? 'NOTE'),
          description: String(form.get('description') ?? ''),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to add interaction')
      setInteractions((prev) => [data.interaction, ...prev])
      ;(event.target as HTMLFormElement).reset()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add interaction')
    }
  }

  if (loading) return <LoadingState title="Loading lead…" />
  if (error || !lead) {
    return (
      <ErrorState
        title="Could not load lead"
        description={error ?? 'Lead not found'}
        action={
          <Button variant="secondary" onClick={() => router.refresh()}>
            Retry
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/leads" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to leads
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{lead.name}</h1>
      </div>

      {actionError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {actionError}
        </p>
      ) : null}

      <Card>
        <h2 className="text-sm font-medium text-zinc-200">Information</h2>
        {canUpdate ? (
          <form className="mt-4 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <Field label="Name" name="name" defaultValue={lead.name} required />
            <Field label="Company" name="companyName" defaultValue={lead.companyName ?? ''} />
            <Field label="Email" name="email" type="email" defaultValue={lead.email ?? ''} />
            <Field label="Phone" name="phone" defaultValue={lead.phone ?? ''} />
            <Field label="Document" name="document" defaultValue={lead.document ?? ''} />
            <Field label="Source" name="source" defaultValue={lead.source ?? ''} />
            <div>
              <label className="text-xs text-zinc-500" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={lead.notes ?? ''}
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <p className="text-sm text-zinc-400">
              Partner: {lead.partner?.name ?? '—'}
            </p>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Info label="Company" value={lead.companyName ?? '—'} />
            <Info label="Email" value={lead.email ?? '—'} />
            <Info label="Phone" value={lead.phone ?? '—'} />
            <Info label="Document" value={lead.document ?? '—'} />
            <Info label="Source" value={lead.source ?? '—'} />
            <Info label="Partner" value={lead.partner?.name ?? '—'} />
            <Info label="Notes" value={lead.notes ?? '—'} />
          </dl>
        )}
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-zinc-200">Interaction history</h2>
        {canCreateInteraction ? (
          <form className="mt-4 space-y-3 border-b border-zinc-800 pb-4" onSubmit={(e) => void onAddInteraction(e)}>
            <div>
              <label className="text-xs text-zinc-500" htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                {INTERACTION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows={2}
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <Button type="submit">Register interaction</Button>
          </form>
        ) : null}
        <ul className="mt-4 space-y-3">
          {interactions.length === 0 ? (
            <li className="text-sm text-zinc-500">No interactions recorded yet.</li>
          ) : (
            interactions.map((item) => (
              <li key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">{item.type}</span>
                  <span>{new Date(item.occurredAt).toLocaleString()}</span>
                  {item.createdBy ? <span>· {item.createdBy.name}</span> : null}
                </div>
                <p className="mt-2 text-sm text-zinc-200">{item.description}</p>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
      />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-100">{value}</dd>
    </div>
  )
}

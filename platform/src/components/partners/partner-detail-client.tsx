'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type Partner = {
  id: string
  name: string
  legalName: string | null
  document: string | null
  email: string | null
  phone: string | null
  notes: string | null
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  userId: string | null
}

type PartnerDetailClientProps = {
  partnerId: string
  canUpdate: boolean
  canActivate: boolean
}

export function PartnerDetailClient({
  partnerId,
  canUpdate,
  canActivate,
}: PartnerDetailClientProps) {
  const router = useRouter()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/partners/${partnerId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load partner')
        setPartner(data.partner)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load partner')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [partnerId])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!partner || !canUpdate) return

    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)

    try {
      const res = await fetch(`/api/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          legalName: String(form.get('legalName') ?? '') || null,
          document: String(form.get('document') ?? '') || null,
          email: String(form.get('email') ?? '') || null,
          phone: String(form.get('phone') ?? '') || null,
          notes: String(form.get('notes') ?? '') || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update partner')
      setPartner(data.partner)
      router.refresh()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update partner')
    } finally {
      setSaving(false)
    }
  }

  async function onActivate() {
    setActionError(null)
    try {
      const res = await fetch(`/api/partners/${partnerId}/activate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to activate partner')
      setPartner(data.partner)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to activate partner')
    }
  }

  async function onDeactivate() {
    setActionError(null)
    try {
      const res = await fetch(`/api/partners/${partnerId}/deactivate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to deactivate partner')
      setPartner(data.partner)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to deactivate partner')
    }
  }

  if (loading) return <LoadingState title="Loading partner…" />
  if (error || !partner) {
    return (
      <ErrorState
        title="Could not load partner"
        description={error ?? 'Partner not found'}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/app/partners" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back to partners
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{partner.name}</h1>
          <p className="text-sm text-zinc-400">Status: {partner.status}</p>
        </div>
        {canActivate ? (
          <div className="flex flex-wrap gap-2">
            {partner.status !== 'ACTIVE' ? (
              <Button onClick={() => void onActivate()}>Activate</Button>
            ) : null}
            {partner.status !== 'INACTIVE' ? (
              <Button variant="secondary" onClick={() => void onDeactivate()}>
                Deactivate
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {actionError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {actionError}
        </p>
      ) : null}

      <Card>
        {canUpdate ? (
          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <Field label="Name" name="name" defaultValue={partner.name} required />
            <Field label="Legal name" name="legalName" defaultValue={partner.legalName ?? ''} />
            <Field label="Document" name="document" defaultValue={partner.document ?? ''} />
            <Field label="Email" name="email" type="email" defaultValue={partner.email ?? ''} />
            <Field label="Phone" name="phone" defaultValue={partner.phone ?? ''} />
            <div>
              <label className="text-xs text-zinc-500" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={partner.notes ?? ''}
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <Info label="Name" value={partner.name} />
            <Info label="Legal name" value={partner.legalName ?? '—'} />
            <Info label="Document" value={partner.document ?? '—'} />
            <Info label="Email" value={partner.email ?? '—'} />
            <Info label="Phone" value={partner.phone ?? '—'} />
            <Info label="Notes" value={partner.notes ?? '—'} />
          </dl>
        )}
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
      <label className="text-xs text-zinc-500" htmlFor={name}>
        {label}
      </label>
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

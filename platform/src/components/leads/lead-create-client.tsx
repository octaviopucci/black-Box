'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'

type PartnerOption = { id: string; name: string }

export function LeadCreateClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [partners, setPartners] = useState<PartnerOption[]>([])

  useEffect(() => {
    async function loadPartners() {
      try {
        const res = await fetch('/api/partners')
        if (!res.ok) return
        const data = await res.json()
        setPartners((data.partners ?? []).map((p: PartnerOption) => ({ id: p.id, name: p.name })))
      } catch {
        // optional field — ignore load failure
      }
    }
    void loadPartners()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    const partnerId = String(form.get('partnerId') ?? '')
    const payload = {
      name: String(form.get('name') ?? ''),
      companyName: String(form.get('companyName') ?? '') || undefined,
      email: String(form.get('email') ?? '') || undefined,
      phone: String(form.get('phone') ?? '') || undefined,
      document: String(form.get('document') ?? '') || undefined,
      source: String(form.get('source') ?? '') || undefined,
      notes: String(form.get('notes') ?? '') || undefined,
      partnerId: partnerId || undefined,
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create lead')
      router.push(`/app/leads/${data.lead.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/leads" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to leads
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">New Lead</h1>
      </div>

      {error ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Card>
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <Field label="Name *" name="name" required />
          <Field label="Company" name="companyName" />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <Field label="Document" name="document" />
          <div>
            <label className="text-xs text-zinc-500" htmlFor="partnerId">Partner</label>
            <select
              id="partnerId"
              name="partnerId"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="">No partner</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Field label="Source" name="source" />
          <div>
            <label className="text-xs text-zinc-500" htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create lead'}
            </Button>
            <Link href="/app/leads">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
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
        required={required}
        className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
      />
    </div>
  )
}

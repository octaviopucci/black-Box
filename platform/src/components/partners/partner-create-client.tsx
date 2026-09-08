'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'

export function PartnerCreateClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get('name') ?? ''),
      legalName: String(form.get('legalName') ?? '') || undefined,
      document: String(form.get('document') ?? '') || undefined,
      email: String(form.get('email') ?? '') || undefined,
      phone: String(form.get('phone') ?? '') || undefined,
      notes: String(form.get('notes') ?? '') || undefined,
    }

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create partner')
      router.push(`/app/partners/${data.partner.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create partner')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/partners" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to partners
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">New partner</h1>
        <p className="text-sm text-zinc-400">Partners start as PENDING until activated.</p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Card>
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <Field label="Name" name="name" required />
          <Field label="Legal name" name="legalName" />
          <Field label="Document" name="document" />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <div>
            <label className="text-xs text-zinc-500" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create partner'}
            </Button>
            <Link href="/app/partners">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
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
      <label className="text-xs text-zinc-500" htmlFor={name}>
        {label}
      </label>
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

'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { PRODUCT_CATEGORIES } from '@/modules/products/domain/catalog-status'

type ProductCreateClientProps = {
  canCreate: boolean
}

export function ProductCreateClient({ canCreate }: ProductCreateClientProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!canCreate) {
    return (
      <p className="text-sm text-zinc-400">Você não tem permissão para criar produtos.</p>
    )
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          slug: String(form.get('slug') ?? '') || undefined,
          description: String(form.get('description') ?? '') || undefined,
          category: String(form.get('category') ?? '') || undefined,
          status: String(form.get('status') ?? 'DRAFT'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create product')
      router.push(`/app/products/${data.product.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/app/products" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Novo produto</h1>
      </div>
      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          {error ? (
            <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <input name="name" required placeholder="Nome *" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input name="slug" placeholder="Slug (opcional)" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <textarea name="description" rows={3} placeholder="Descrição" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <select name="category" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
            <option value="">Sem categoria</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <select name="status" defaultValue="DRAFT" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Criando…' : 'Criar produto'}
            </Button>
            <Link href="/app/products">
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

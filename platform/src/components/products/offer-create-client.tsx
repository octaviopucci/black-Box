'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type OfferCreateClientProps = {
  productId: string
  canCreate: boolean
}

export function OfferCreateClient({ productId, canCreate }: OfferCreateClientProps) {
  const router = useRouter()
  const [productName, setProductName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${productId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load product')
        setProductName(data.product.name)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [productId])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreate) return
    setSaving(true)
    setSubmitError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/products/${productId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          slug: String(form.get('slug') ?? '') || undefined,
          description: String(form.get('description') ?? '') || undefined,
          price: Number(form.get('price') ?? 0),
          currency: String(form.get('currency') ?? 'BRL'),
          status: String(form.get('status') ?? 'DRAFT'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create offer')
      router.push(`/app/products/${productId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create offer')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState title="Carregando…" />
  if (error) {
    return (
      <ErrorState
        title="Produto não encontrado"
        description={error}
        action={
          <Link href="/app/products">
            <Button variant="secondary">Voltar</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href={`/app/products/${productId}`} className="text-sm text-zinc-500 hover:text-zinc-300">
          ← {productName}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nova oferta</h1>
      </div>
      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          {submitError ? (
            <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              {submitError}
            </p>
          ) : null}
          <input name="name" required placeholder="Nome da oferta *" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input name="slug" placeholder="Slug (opcional)" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <textarea name="description" rows={3} placeholder="Descrição comercial" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" min={0} step="0.01" required placeholder="Preço *" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            <input name="currency" defaultValue="BRL" maxLength={3} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          </div>
          <select name="status" defaultValue="DRAFT" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving || !canCreate}>
              {saving ? 'Criando…' : 'Criar oferta'}
            </Button>
            <Link href={`/app/products/${productId}`}>
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

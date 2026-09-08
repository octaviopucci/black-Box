'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type CustomerDetailClientProps = {
  customerId: string
}

type SaleRow = {
  id: string
  status: string
  offerNameSnapshot: string
  finalPrice: string
  currency: string
  paidAt: string | null
  createdAt: string
}

export function CustomerDetailClient({ customerId }: CustomerDetailClientProps) {
  const [customer, setCustomer] = useState<Record<string, unknown> | null>(null)
  const [lead, setLead] = useState<{ id: string; name: string; source: string | null } | null>(null)
  const [partner, setPartner] = useState<{ id: string; name: string } | null>(null)
  const [sales, setSales] = useState<SaleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/customers/${customerId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load customer')
      setCustomer(data.customer)
      setLead(data.lead ?? null)
      setPartner(data.partner ?? null)
      setSales(data.sales ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <LoadingState title="Loading customer..." />
  if (error || !customer) {
    return (
      <ErrorState
        title="Failed to load customer"
        description={error ?? 'Customer not found'}
        action={
          <Button variant="secondary" onClick={() => void load()}>
            Retry
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/customers" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Back to customers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{String(customer.name)}</h1>
        {customer.companyName != null && String(customer.companyName).length > 0 && (
          <p className="text-sm text-zinc-400">{String(customer.companyName)}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-5 text-sm">
          <h2 className="font-medium">Contact</h2>
          <p>Email: {String(customer.email ?? '—')}</p>
          <p>Phone: {String(customer.phone ?? '—')}</p>
          <p>Document: {String(customer.document ?? '—')}</p>
          <p>Status: {String(customer.status)}</p>
        </Card>

        <Card className="space-y-2 p-5 text-sm">
          <h2 className="font-medium">Origin</h2>
          {lead ? (
            <>
              <p>Lead: {lead.name}</p>
              <p className="text-zinc-500">Source: {lead.source ?? '—'}</p>
            </>
          ) : (
            <p className="text-zinc-500">No linked lead</p>
          )}
          <p>Partner: {partner?.name ?? '—'}</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 font-medium">Sales history</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-zinc-500">No sales yet</p>
        ) : (
          <ul className="space-y-3">
            {sales.map((sale) => (
              <li key={sale.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 text-sm">
                <div>
                  <Link href={`/app/sales/${sale.id}`} className="font-medium hover:underline">
                    {sale.offerNameSnapshot}
                  </Link>
                  <p className="text-zinc-500">{sale.status}</p>
                </div>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: sale.currency }).format(Number(sale.finalPrice))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

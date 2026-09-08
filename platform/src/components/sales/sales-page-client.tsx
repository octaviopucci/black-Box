'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Sale = {
  id: string
  status: 'DRAFT' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
  offerNameSnapshot: string
  productNameSnapshot: string
  finalPrice: string
  currency: string
  soldAt: string | null
  paidAt: string | null
  createdAt: string
  customer: { id: string; name: string; email: string | null; companyName: string | null }
  partner: { id: string; name: string } | null
}

type SalesPageClientProps = {
  canCreate: boolean
}

function formatMoney(value: string, currency: string) {
  const num = Number(value)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(num)
}

function StatusBadge({ status }: { status: Sale['status'] }) {
  const styles = {
    DRAFT: 'bg-zinc-800 text-zinc-300',
    PENDING_PAYMENT: 'bg-amber-950 text-amber-300',
    PAID: 'bg-emerald-950 text-emerald-300',
    CANCELED: 'bg-red-950/60 text-red-300',
  } as const
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export function SalesPageClient({ canCreate }: SalesPageClientProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [total, setTotal] = useState(0)

  const loadSales = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      const res = await fetch(`/api/sales?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load sales')
      setSales(data.sales ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sales')
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    void loadSales()
  }, [loadSales])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Sales</h1>
          <p className="text-sm text-zinc-400">Commercial sales registry</p>
        </div>
        {canCreate && (
          <Link href="/app/sales/new">
            <Button>New sale</Button>
          </Link>
        )}
      </div>

      <Card className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Search customer or offer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_PAYMENT">Pending payment</option>
            <option value="PAID">Paid</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>

        {loading && <LoadingState title="Loading sales..." />}
        {error && (
          <ErrorState
            title="Failed to load sales"
            description={error}
            action={
              <Button variant="secondary" onClick={() => void loadSales()}>
                Retry
              </Button>
            }
          />
        )}
        {!loading && !error && sales.length === 0 && (
          <EmptyState title="No sales yet" description="Create your first sale to get started." />
        )}

        {!loading && !error && sales.length > 0 && (
          <>
            <p className="text-xs text-zinc-500">{total} sale(s)</p>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Offer</th>
                    <th className="pb-2 pr-4">Partner</th>
                    <th className="pb-2 pr-4">Value</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-zinc-900">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{sale.customer.name}</p>
                        {sale.customer.companyName && (
                          <p className="text-xs text-zinc-500">{sale.customer.companyName}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <p>{sale.offerNameSnapshot}</p>
                        <p className="text-xs text-zinc-500">{sale.productNameSnapshot}</p>
                      </td>
                      <td className="py-3 pr-4">{sale.partner?.name ?? '—'}</td>
                      <td className="py-3 pr-4 font-medium">
                        {formatMoney(sale.finalPrice, sale.currency)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={sale.status} />
                      </td>
                      <td className="py-3">
                        <Link href={`/app/sales/${sale.id}`} className="text-sm text-zinc-300 hover:text-white">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {sales.map((sale) => (
                <Card key={sale.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-sm text-zinc-400">{sale.offerNameSnapshot}</p>
                    </div>
                    <StatusBadge status={sale.status} />
                  </div>
                  <p className="mt-2 text-lg font-semibold">
                    {formatMoney(sale.finalPrice, sale.currency)}
                  </p>
                  <Link href={`/app/sales/${sale.id}`} className="mt-3 inline-block text-sm text-zinc-300">
                    View details →
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

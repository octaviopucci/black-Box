'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Partner = {
  id: string
  name: string
  email: string | null
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  phone: string | null
}

type PartnersPageProps = {
  canCreate: boolean
}

export function PartnersPageClient({ canCreate }: PartnersPageProps) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPartners = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/partners')
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error?.message ?? 'Failed to load partners')
      }
      setPartners(data.partners ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load partners')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPartners()
  }, [loadPartners])

  if (loading) return <LoadingState title="Loading partners…" />
  if (error) {
    return (
      <ErrorState
        title="Could not load partners"
        description={error}
        action={
          <Button variant="secondary" onClick={() => void loadPartners()}>
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
          <h1 className="text-2xl font-semibold tracking-tight">Partners</h1>
          <p className="text-sm text-zinc-400">Commercial partners in your organization.</p>
        </div>
        {canCreate ? (
          <Link href="/app/partners/new">
            <Button>New partner</Button>
          </Link>
        ) : null}
      </div>

      {partners.length === 0 ? (
        <EmptyState
          title="No partners yet"
          description="Create your first partner to start building your commercial network."
          action={
            canCreate ? (
              <Link href="/app/partners/new">
                <Button>Create partner</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Link key={partner.id} href={`/app/partners/${partner.id}`}>
              <Card className="transition hover:border-zinc-600">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium text-zinc-100">{partner.name}</h2>
                  <StatusBadge status={partner.status} />
                </div>
                {partner.email ? (
                  <p className="mt-2 text-sm text-zinc-400">{partner.email}</p>
                ) : null}
                {partner.phone ? (
                  <p className="mt-1 text-xs text-zinc-500">{partner.phone}</p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: Partner['status'] }) {
  const styles = {
    PENDING: 'bg-amber-500/15 text-amber-300',
    ACTIVE: 'bg-emerald-500/15 text-emerald-300',
    INACTIVE: 'bg-zinc-500/15 text-zinc-400',
  } as const

  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

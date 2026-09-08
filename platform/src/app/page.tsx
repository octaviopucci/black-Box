'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/primitives'
import { Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type HealthResponse = {
  ok: boolean
  service: string
  status: string
  checks: { application: boolean; database: boolean }
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadHealth() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error(`Health check failed (${res.status})`)
      setHealth(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadHealth()
  }, [])

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Platform foundation</h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          App shell and infrastructure for the Black Box Revenue Operating System.
          Business modules (Leads, CRM, Sales, etc.) will be added in missions 02–15.
        </p>
      </section>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-zinc-200">System health</h2>
            <p className="text-xs text-zinc-500">GET /api/health</p>
          </div>
          <Button variant="secondary" onClick={() => void loadHealth()} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-4">
          {loading ? (
            <LoadingState title="Checking health" description="Verifying application and database." />
          ) : error ? (
            <ErrorState
              title="Health check unavailable"
              description={error}
              action={
                <Button variant="secondary" onClick={() => void loadHealth()}>
                  Retry
                </Button>
              }
            />
          ) : health ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <HealthItem label="Service" value={health.service} />
              <HealthItem label="Status" value={health.status} />
              <HealthItem label="Application" value={health.checks.application ? 'ok' : 'fail'} />
              <HealthItem label="Database" value={health.checks.database ? 'connected' : 'unavailable'} />
            </dl>
          ) : (
            <EmptyState title="No health data" description="Run the health check to inspect system status." />
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-zinc-200">Infrastructure placeholders</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Navigation items are disabled until their missions land. This is intentional — no fake business UI.
        </p>
      </Card>
    </div>
  )
}

function HealthItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-100">{value}</dd>
    </div>
  )
}

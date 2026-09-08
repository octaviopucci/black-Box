import Link from 'next/link'
import { AppShell } from '@/components/shell/app-shell'
import { Card } from '@/components/ui/primitives'

export default function PublicHomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Black Box Platform</h1>
          <p className="max-w-2xl text-sm text-zinc-400">
            Revenue Operating System foundation. Sign in to access the authenticated area.
          </p>
        </section>

        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-zinc-200">Authenticated access</h2>
            <p className="mt-1 text-sm text-zinc-400">Mission 02 — Auth + Organization</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
          >
            Sign in
          </Link>
        </Card>
      </div>
    </AppShell>
  )
}

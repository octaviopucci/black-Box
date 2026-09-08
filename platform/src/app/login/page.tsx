'use client'

import { Suspense, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui/primitives'
import { ErrorState } from '@/components/ui/states'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (loading) return

    setValidationError(null)
    setAuthError(null)

    if (!email.trim()) {
      setValidationError('Email is required')
      return
    }
    if (!password) {
      setValidationError('Password is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setAuthError(data?.error?.message ?? 'Invalid credentials')
        return
      }

      if (data.requiresOrganizationSelection) {
        router.replace('/app/select-organization')
        return
      }

      router.replace(nextPath)
    } catch {
      setAuthError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-zinc-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-zinc-300">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {validationError ? (
          <p className="text-sm text-red-400" role="alert">
            {validationError}
          </p>
        ) : null}

        {authError ? (
          <ErrorState title="Sign in failed" description={authError} className="p-4" />
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-sm font-bold text-zinc-950">
            BB
          </div>
          <h1 className="text-xl font-semibold text-zinc-100">Sign in</h1>
          <p className="mt-1 text-sm text-zinc-400">Black Box Platform</p>
        </div>

        <Suspense fallback={<Card><p className="text-sm text-zinc-400">Loading…</p></Card>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

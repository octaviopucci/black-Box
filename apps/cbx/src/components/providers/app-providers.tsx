'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { AuthGate } from '@/components/providers/auth-gate'

const apiEnabled = process.env.NEXT_PUBLIC_USE_API === '1'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const body = (
    <AuthGate>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </AuthGate>
  )

  if (!apiEnabled) return body
  return <SessionProvider>{body}</SessionProvider>
}

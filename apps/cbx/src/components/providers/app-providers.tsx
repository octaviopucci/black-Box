'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { RewardedAdHost } from '@/components/ads/rewarded-ad-host'

const useApi = process.env.NEXT_PUBLIC_USE_API === '1'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const body = (
    <>
      {children}
      <RewardedAdHost />
      <Toaster position="top-center" richColors closeButton />
    </>
  )

  // SessionProvider hits /api/auth — only in server/API mode
  if (!useApi) return body
  return <SessionProvider>{body}</SessionProvider>
}

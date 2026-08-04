'use client'

import { Toaster } from 'sonner'
import { RewardedAdHost } from '@/components/ads/rewarded-ad-host'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RewardedAdHost />
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}

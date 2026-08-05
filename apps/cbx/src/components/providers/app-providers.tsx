'use client'

import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { RewardedAdHost } from '@/components/ads/rewarded-ad-host'
import { bootNativeShell } from '@/lib/native-boot'

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void bootNativeShell()
  }, [])

  return (
    <>
      {children}
      <RewardedAdHost />
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}

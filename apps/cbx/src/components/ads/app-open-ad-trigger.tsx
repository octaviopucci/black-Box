'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAdsStore } from '@/stores/ads-store'
import { ROUTES } from '@/constants/brand'

/**
 * Triggers app_open rewarded ad once when free users land on the main shell.
 */
export function AppOpenAdTrigger() {
  const pathname = usePathname()
  const requested = useRef(false)
  const requestUnlock = useAdsStore((s) => s.requestUnlock)
  const isUnlocked = useAdsStore((s) => s.isUnlocked)
  const isAdFree = useAdsStore((s) => s.isAdFree)

  useEffect(() => {
    if (requested.current) return
    if (isAdFree()) return
    if (pathname.startsWith('/splash') || pathname.startsWith('/onboarding')) return
    if (pathname.startsWith('/login') || pathname.startsWith('/cadastro')) return
    if (isUnlocked('app_open')) return

    requested.current = true
    // Slight delay so first paint feels snappy
    const t = window.setTimeout(() => {
      requestUnlock('app_open', () => undefined)
    }, 600)
    return () => window.clearTimeout(t)
  }, [pathname, requestUnlock, isUnlocked, isAdFree])

  return null
}

/** Soft badge for free plan reminding about ads / upgrade. */
export function FreePlanAdBadge() {
  const isAdFree = useAdsStore((s) => s.isAdFree)
  const router = useRouter()
  if (isAdFree()) return null

  return (
    <button
      type="button"
      onClick={() => router.push(ROUTES.planos)}
      className="fixed bottom-[4.75rem] left-1/2 z-40 -translate-x-1/2 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold text-secondary-foreground shadow-lg md:bottom-4"
    >
      Plano gratuito · anúncios ativos · Upgrade
    </button>
  )
}

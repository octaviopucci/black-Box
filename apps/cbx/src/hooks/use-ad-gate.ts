'use client'

import { useCallback } from 'react'
import { useAdsStore } from '@/stores/ads-store'
import type { AdPlacement } from '@/types/ads'
import { AD_PLACEMENTS } from '@/types/ads'

/**
 * Gate a free-tier action behind a rewarded video ad.
 * Premium / Empresarial skip automatically.
 */
export function useAdGate() {
  const requestUnlock = useAdsStore((s) => s.requestUnlock)
  const isUnlocked = useAdsStore((s) => s.isUnlocked)
  const isAdFree = useAdsStore((s) => s.isAdFree)
  const plan = useAdsStore((s) => s.getEffectivePlan())

  const runWithAd = useCallback(
    (placement: AdPlacement, action: () => void) => {
      requestUnlock(placement, action)
    },
    [requestUnlock],
  )

  const placementMeta = useCallback((placement: AdPlacement) => AD_PLACEMENTS[placement], [])

  return {
    runWithAd,
    isUnlocked,
    isAdFree: isAdFree(),
    plan,
    placementMeta,
  }
}

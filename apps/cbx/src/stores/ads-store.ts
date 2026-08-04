'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanTier } from '@/types'
import type { AdPlacement } from '@/types/ads'
import { AD_PLACEMENTS, planRequiresAds } from '@/types/ads'
import { userService } from '@/services'

interface UnlockRecord {
  expiresAt: number
}

interface AdsState {
  /** Override demo plan — defaults to current user plan. */
  planOverride: PlanTier | null
  unlocks: Partial<Record<AdPlacement, UnlockRecord>>
  pendingPlacement: AdPlacement | null
  pendingAction: (() => void) | null
  setPlanOverride: (plan: PlanTier | null) => void
  getEffectivePlan: () => PlanTier
  isAdFree: () => boolean
  isUnlocked: (placement: AdPlacement) => boolean
  requestUnlock: (placement: AdPlacement, onUnlocked: () => void) => void
  completeAd: (placement: AdPlacement) => void
  cancelAd: () => void
  clearPending: () => void
}

export const useAdsStore = create<AdsState>()(
  persist(
    (set, get) => ({
      planOverride: 'gratuito',
      unlocks: {},
      pendingPlacement: null,
      pendingAction: null,

      setPlanOverride: (plan) => set({ planOverride: plan }),

      getEffectivePlan: () => {
        const override = get().planOverride
        if (override) return override
        return userService.current().plan
      },

      isAdFree: () => !planRequiresAds(get().getEffectivePlan()),

      isUnlocked: (placement) => {
        if (get().isAdFree()) return true
        const record = get().unlocks[placement]
        if (!record) return false
        return record.expiresAt > Date.now()
      },

      requestUnlock: (placement, onUnlocked) => {
        if (get().isUnlocked(placement)) {
          onUnlocked()
          return
        }
        set({ pendingPlacement: placement, pendingAction: onUnlocked })
      },

      completeAd: (placement) => {
        const ttl = AD_PLACEMENTS[placement].unlockTtlMs
        const { pendingAction, unlocks } = get()
        set({
          unlocks: {
            ...unlocks,
            [placement]: { expiresAt: Date.now() + ttl },
          },
          pendingPlacement: null,
          pendingAction: null,
        })
        pendingAction?.()
      },

      cancelAd: () => set({ pendingPlacement: null, pendingAction: null }),

      clearPending: () => set({ pendingPlacement: null, pendingAction: null }),
    }),
    {
      name: 'cbx-ads-store',
      partialize: (s) => ({
        planOverride: s.planOverride,
        unlocks: s.unlocks,
      }),
    },
  ),
)

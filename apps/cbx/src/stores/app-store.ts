'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_USER_ID } from '@/mocks'

interface AppState {
  favorites: string[]
  recentViews: string[]
  searchQuery: string
  onboardingDone: boolean
  isAuthenticated: boolean
  currentUserId: string
  unreadNotifications: number
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  addRecentView: (productId: string) => void
  setSearchQuery: (q: string) => void
  completeOnboarding: () => void
  login: () => void
  logout: () => void
  setUnreadNotifications: (n: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentViews: [],
      searchQuery: '',
      onboardingDone: false,
      isAuthenticated: true,
      currentUserId: CURRENT_USER_ID,
      unreadNotifications: 3,
      toggleFavorite: (productId) => {
        const { favorites } = get()
        set({
          favorites: favorites.includes(productId)
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId],
        })
      },
      isFavorite: (productId) => get().favorites.includes(productId),
      addRecentView: (productId) => {
        const { recentViews } = get()
        set({
          recentViews: [productId, ...recentViews.filter((id) => id !== productId)].slice(0, 20),
        })
      },
      setSearchQuery: (q) => set({ searchQuery: q }),
      completeOnboarding: () => set({ onboardingDone: true }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      setUnreadNotifications: (n) => set({ unreadNotifications: n }),
    }),
    {
      name: 'cbx-app-store',
      partialize: (s) => ({
        favorites: s.favorites,
        recentViews: s.recentViews,
        onboardingDone: s.onboardingDone,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
)

interface PublishDraft {
  images: string[]
  categoryId: string
  title: string
  description: string
  price: string
  condition: 'novo' | 'seminovo' | 'usado' | ''
  neighborhood: string
  plan: 'gratuito' | 'premium' | 'empresarial'
  step: number
  setField: <K extends keyof PublishDraft>(key: K, value: PublishDraft[K]) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const draftDefaults = {
  images: [] as string[],
  categoryId: '',
  title: '',
  description: '',
  price: '',
  condition: '' as const,
  neighborhood: 'Centro',
  plan: 'gratuito' as const,
  step: 0,
}

export const usePublishStore = create<PublishDraft>((set, get) => ({
  ...draftDefaults,
  setField: (key, value) => set({ [key]: value } as Partial<PublishDraft>),
  nextStep: () => set({ step: Math.min(get().step + 1, 9) }),
  prevStep: () => set({ step: Math.max(get().step - 1, 0) }),
  reset: () => set(draftDefaults),
}))

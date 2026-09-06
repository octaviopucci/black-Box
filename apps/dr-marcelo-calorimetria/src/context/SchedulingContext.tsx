import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type SchedulingContextValue = {
  isOpen: boolean
  openScheduling: () => void
  closeScheduling: () => void
}

const SchedulingContext = createContext<SchedulingContextValue | null>(null)

export function SchedulingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openScheduling = useCallback(() => setIsOpen(true), [])
  const closeScheduling = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, openScheduling, closeScheduling }),
    [isOpen, openScheduling, closeScheduling],
  )

  return <SchedulingContext.Provider value={value}>{children}</SchedulingContext.Provider>
}

export function useScheduling() {
  const ctx = useContext(SchedulingContext)
  if (!ctx) throw new Error('useScheduling must be used within SchedulingProvider')
  return ctx
}

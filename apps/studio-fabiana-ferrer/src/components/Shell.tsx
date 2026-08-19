import type { ReactNode } from 'react'

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-paper">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] bg-grain opacity-90 mix-blend-multiply"
      />
      {children}
    </div>
  )
}

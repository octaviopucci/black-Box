import type { ReactNode } from 'react'

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-mist">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-grain opacity-60 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-0 h-[520px] w-[520px] rounded-full bg-mint/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-leaf/20 blur-3xl"
      />
      {children}
    </div>
  )
}

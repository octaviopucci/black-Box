'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface LoadingProps {
  fullPage?: boolean
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const spinnerSizes = {
  sm: 'size-5',
  md: 'size-8',
  lg: 'size-12',
} as const

function Loading({
  fullPage = false,
  label = 'Carregando...',
  className,
  size = 'md',
}: LoadingProps) {
  const spinner = (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Loader2
        className={cn('animate-spin text-primary', spinnerSizes[size])}
        aria-hidden
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

export { Loading }

import * as React from 'react'
import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface RatingProps {
  value: number
  max?: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const starSizes = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
} as const

function Rating({ value, max = 5, count, size = 'md', className }: RatingProps) {
  const clamped = Math.min(Math.max(value, 0), max)

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      role="img"
      aria-label={`Avaliação ${clamped.toFixed(1)} de ${max}${count !== undefined ? `, ${count} avaliações` : ''}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const fill = Math.min(Math.max(clamped - i, 0), 1)
          return (
            <span key={i} className="relative inline-flex">
              <Star
                className={cn(starSizes[size], 'text-muted-foreground/30')}
                aria-hidden
              />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    className={cn(starSizes[size], 'fill-warning text-warning')}
                    aria-hidden
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>
      <span className="text-sm font-medium text-foreground">
        {clamped.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  )
}

export { Rating }

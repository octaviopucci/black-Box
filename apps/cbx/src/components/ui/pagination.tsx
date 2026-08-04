'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const pages = React.useMemo(() => {
    if (totalPages <= 7) return range(1, totalPages)

    const left = Math.max(page - siblingCount, 1)
    const right = Math.min(page + siblingCount, totalPages)
    const showLeftEllipsis = left > 2
    const showRightEllipsis = right < totalPages - 1

    const items: (number | 'ellipsis')[] = [1]

    if (showLeftEllipsis) items.push('ellipsis')
    else if (left > 1) items.push(...range(2, left - 1))

    items.push(...range(left, right))

    if (showRightEllipsis) items.push('ellipsis')
    else if (right < totalPages) items.push(...range(right + 1, totalPages - 1))

    if (totalPages > 1) items.push(totalPages)

    return items
  }, [page, totalPages, siblingCount])

  if (totalPages <= 1) return null

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Paginação"
    >
      <IconButton
        variant="outline"
        size="sm"
        shape="square"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </IconButton>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-8 items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Página ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              item === page
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted',
            )}
          >
            {item}
          </button>
        ),
      )}

      <IconButton
        variant="outline"
        size="sm"
        shape="square"
        aria-label="Próxima página"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </IconButton>
    </nav>
  )
}

export { Pagination }

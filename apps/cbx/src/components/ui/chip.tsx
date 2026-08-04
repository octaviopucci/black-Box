'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      selected: {
        true: 'border-primary bg-primary/10 text-primary',
        false:
          'border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'md',
    },
  },
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof chipVariants> {
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      selected = false,
      size,
      onSelectedChange,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className="inline-flex"
      >
        <button
          ref={ref}
          type="button"
          role="checkbox"
          aria-checked={selected}
          className={cn(chipVariants({ selected, size }), className)}
          onClick={(e) => {
            onSelectedChange?.(!selected)
            onClick?.(e)
          }}
          {...props}
        >
          {children}
        </button>
      </motion.div>
    )
  },
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }

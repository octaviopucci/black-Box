'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-[#9333ea] text-primary-foreground shadow-sm hover:from-primary-hover hover:to-[#7e22ce]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover',
        accent:
          'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        soft: 'bg-primary/10 text-primary hover:bg-primary/15',
        danger:
          'bg-danger text-danger-foreground shadow-sm hover:bg-danger/90',
        success:
          'bg-success text-success-foreground shadow-sm hover:bg-success/90',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
      size: {
        sm: 'size-8 [&_svg]:size-3.5',
        md: 'size-10 [&_svg]:size-4',
        lg: 'size-12 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      shape: 'circle',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      shape,
      size,
      children,
      disabled,
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
          disabled={disabled}
          className={cn(iconButtonVariants({ variant, shape, size, className }))}
          {...props}
        >
          {children}
        </button>
      </motion.div>
    )
  },
)
IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }

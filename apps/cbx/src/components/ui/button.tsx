'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        md: 'h-10 px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 px-6 text-base [&_svg]:size-5',
        icon: 'size-10 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const content = loading ? (
      <>
        <Loader2 className="animate-spin" aria-hidden />
        <span className="sr-only">Carregando</span>
      </>
    ) : (
      children
    )

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
        >
          {content}
        </Slot>
      )
    }

    const isFullWidth = className?.includes('w-full')

    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className={cn(isFullWidth ? 'flex w-full' : 'inline-flex')}
      >
        <button
          ref={ref}
          type="button"
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={disabled || loading}
          {...props}
        >
          {content}
        </button>
      </motion.div>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

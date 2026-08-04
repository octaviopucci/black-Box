import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent: 'bg-accent/10 text-accent',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-danger/10 text-danger',
        neutral: 'bg-muted text-muted-foreground',
        sponsored: 'bg-sponsored text-sponsored-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

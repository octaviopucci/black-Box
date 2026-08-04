'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'size-6 text-[10px]',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-14 text-base',
        xl: 'size-20 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const indicatorSizes = {
  xs: 'size-1.5 border',
  sm: 'size-2 border',
  md: 'size-2.5 border-2',
  lg: 'size-3 border-2',
  xl: 'size-3.5 border-2',
} as const

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  online?: boolean
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, fallback, online, ...props }, ref) => {
  const initials = fallback ? getInitials(fallback) : '?'

  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt ?? fallback ?? 'Avatar'}
            className="aspect-square size-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          delayMs={src ? 600 : 0}
          className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 font-semibold text-primary"
        >
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            online ? 'bg-success' : 'bg-muted-foreground/40',
            size ? indicatorSizes[size] : indicatorSizes.md,
          )}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  )
})
Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from './label'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className={error ? 'text-danger' : undefined}>
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus-visible:ring-danger',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from './label'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <Label htmlFor={textareaId} className={error ? 'text-danger' : undefined}>
            {label}
          </Label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            'flex min-h-[100px] w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }

import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className, error, ...props },
  ref,
) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'input-field',
          error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, className, error, ...props },
  ref,
) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <textarea
        ref={ref}
        className={cn(
          'input-field min-h-[96px] resize-y',
          error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
})

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  children: ReactNode
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, className, children, error, ...props },
  ref,
) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          'input-field',
          error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
})

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...props },
  ref,
) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-white/80', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded border-brand-gray bg-brand-black accent-brand-red"
        {...props}
      />
      {label}
    </label>
  )
})

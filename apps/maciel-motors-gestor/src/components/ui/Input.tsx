import { cn } from '@/utils'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Input({
  label,
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <input
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
}

export function Textarea({
  label,
  className,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <textarea
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
}

export function Select({
  label,
  className,
  children,
  error,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  children: ReactNode
  error?: string
}) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <select
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
}

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-white/80', className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-brand-gray bg-brand-black accent-brand-red"
        {...props}
      />
      {label}
    </label>
  )
}

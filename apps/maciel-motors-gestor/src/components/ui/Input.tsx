import { cn } from '@/utils'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Input({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <input className={cn('input-field', className)} {...props} />
    </label>
  )
}

export function Textarea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <textarea className={cn('input-field min-h-[96px] resize-y', className)} {...props} />
    </label>
  )
}

export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; children: ReactNode }) {
  return (
    <label className="block">
      {label ? <span className="label-field">{label}</span> : null}
      <select className={cn('input-field', className)} {...props}>
        {children}
      </select>
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

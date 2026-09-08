import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-zinc-100 text-zinc-950 hover:bg-white',
        variant === 'secondary' && 'border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800',
        variant === 'ghost' && 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100',
        className,
      )}
      {...props}
    />
  )
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700',
        className,
      )}
      {...props}
    />
  )
}

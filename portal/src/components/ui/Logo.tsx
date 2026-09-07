import { cn } from '../../lib/cn'

type Props = {
  className?: string
  markOnly?: boolean
  /** Larger stacked lockup for footer / hero accents */
  stacked?: boolean
}

export function Logo({ className, markOnly = false, stacked = false }: Props) {
  if (stacked) {
    return (
      <img
        src="/brand/logo-full.webp"
        alt="Black Box Software Factory — Você imagina. Nós construímos."
        width={280}
        height={280}
        className={cn('h-auto w-40 sm:w-48', className)}
        decoding="async"
      />
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-3 text-paper', className)}>
      <img
        src="/brand/logo-mark.webp"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        decoding="async"
      />
      {markOnly ? (
        <span className="sr-only">Black Box</span>
      ) : (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.2em]">
            Black Box
          </span>
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.32em] text-mute">
            Software Factory
          </span>
        </span>
      )}
    </span>
  )
}

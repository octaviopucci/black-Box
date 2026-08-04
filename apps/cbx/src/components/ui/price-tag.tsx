import { cn, formatCurrency } from '@/lib/utils'

export interface PriceTagProps {
  price: number
  oldPrice?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

function PriceTag({ price, oldPrice, className, size = 'md' }: PriceTagProps) {
  const economy =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null

  const sizeClasses = {
    sm: { price: 'text-sm', old: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { price: 'text-lg', old: 'text-sm', badge: 'text-xs px-2 py-0.5' },
    lg: { price: 'text-2xl', old: 'text-base', badge: 'text-xs px-2 py-1' },
  }

  const sizes = sizeClasses[size]

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-bold text-foreground', sizes.price)}>
        {formatCurrency(price)}
      </span>
      {oldPrice !== undefined && oldPrice > price && (
        <>
          <span
            className={cn('text-muted-foreground line-through', sizes.old)}
            aria-label={`Preço anterior ${formatCurrency(oldPrice)}`}
          >
            {formatCurrency(oldPrice)}
          </span>
          {economy !== null && economy > 0 && (
            <span
              className={cn(
                'rounded-full bg-success/10 font-semibold text-success',
                sizes.badge,
              )}
            >
              -{economy}%
            </span>
          )}
        </>
      )}
    </div>
  )
}

export { PriceTag }

import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
}

export function BrandMark({ className = '', compact = false }: Props) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="NA Veículos — início"
    >
      <span className="relative grid place-items-center">
        <svg
          viewBox="0 0 72 28"
          className={compact ? 'h-7 w-[4.5rem]' : 'h-9 w-[5.75rem]'}
          fill="none"
          aria-hidden
        >
          <path
            d="M2 18 C10 16, 18 8, 28 6 C40 3.5, 48 4, 58 8 C64 10.5, 68 14, 70 16"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-chrome"
          />
          <path
            d="M16 20c2.2-2.4 5.2-2.4 7.4 0"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-chrome-mute"
          />
          <path
            d="M46 20c2.2-2.4 5.2-2.4 7.4 0"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-chrome-mute"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-brand text-2xl italic tracking-tight text-chrome-soft sm:text-[1.65rem]">
          N.A.
        </span>
        {!compact && (
          <span className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.42em] text-chrome-mute">
            Veículos
          </span>
        )}
      </span>
    </Link>
  )
}

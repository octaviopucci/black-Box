type Props = {
  className?: string
  tone?: 'wine' | 'rose' | 'cream' | 'ink'
}

const tones = {
  wine: 'text-wine',
  rose: 'text-rose',
  cream: 'text-cream',
  ink: 'text-ink',
}

/** Tooth-heart line mark — faithful to Clínica Matsubara logo */
export function BrandMark({ className = 'h-9 w-9', tone = 'wine' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${className} ${tones[tone]}`}
      aria-hidden
    >
      <path
        d="M32 10c-5.2 0-9.2 3.4-10.6 8.2C19.8 22.8 18 26.2 18 30.8c0 6.4 3.2 12.2 7.2 17.2 2.6 3.2 5.2 5.6 6.8 6.6.6.4 1.4.4 2 0 1.6-1 4.2-3.4 6.8-6.6 4-5 7.2-10.8 7.2-17.2 0-4.6-1.8-8-3.4-12.6C41.2 13.4 37.2 10 32 10Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M26.5 28.5c2.2-3.8 8.8-3.8 11 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M32 36.5c-2.8 0-4.6 2-4.6 4.4 0 3.2 4.6 6.2 4.6 6.2s4.6-3 4.6-6.2c0-2.4-1.8-4.4-4.6-4.4Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

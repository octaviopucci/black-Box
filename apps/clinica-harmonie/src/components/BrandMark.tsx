type Props = {
  className?: string
  tone?: 'gold' | 'porcelain' | 'ink'
}

const tones = {
  gold: 'text-gold',
  porcelain: 'text-porcelain',
  ink: 'text-ink',
}

export function BrandMark({ className = 'h-9 w-9', tone = 'gold' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${className} ${tones[tone]}`}
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M22 18v28M42 18v28M22 32h20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M22 32c4-8 16-8 20 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

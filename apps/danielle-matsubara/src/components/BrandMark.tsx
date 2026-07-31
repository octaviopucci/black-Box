type Props = {
  className?: string
  tone?: 'wine' | 'rose' | 'cream'
}

export function BrandMark({ className = 'h-8 w-8', tone = 'wine' }: Props) {
  const stroke = tone === 'cream' ? '#F7F1EC' : tone === 'rose' ? '#C48A94' : '#78243C'
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M32 10 C22 18 16 28 16 38 C16 48 22 54 32 54 C42 54 48 48 48 38 C48 28 42 18 32 10 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 22 C28 26 26 30 26 34 C26 38 28.5 40.5 32 40.5 C35.5 40.5 38 38 38 34 C38 30 36 26 32 22 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        opacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

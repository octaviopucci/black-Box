type Props = {
  className?: string
  tone?: 'gold' | 'bone'
}

export function BrandMark({ className = 'h-10 w-10', tone = 'gold' }: Props) {
  const stroke = tone === 'gold' ? '#B8956A' : '#E8E2D6'
  const fill = tone === 'gold' ? '#B8956A' : '#E8E2D6'

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="1.25" />
      <path
        d="M20.5 44.5V19.5h9.2c5.9 0 9.5 3.1 9.5 8 0 3.5-1.9 6-5 7.2l5.8 9.8h-5.9l-5.4-9.4h-3.6v9.4h-4.6zm5-14.6h3.4c2.6 0 4.1-1.3 4.1-3.5s-1.5-3.4-4.1-3.4H25.5v6.9z"
        fill={fill}
      />
      <path
        d="M41 44.5V19.5h3.2l9.2 14.8V19.5H58v25h-3.2l-9.2-14.9v14.9H41z"
        fill={tone === 'gold' ? '#E8E2D6' : '#B8956A'}
      />
    </svg>
  )
}

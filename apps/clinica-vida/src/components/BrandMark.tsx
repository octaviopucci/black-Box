type Props = {
  className?: string
  tone?: 'vida' | 'paper' | 'ink'
}

const tones = {
  vida: 'text-vida',
  paper: 'text-paper',
  ink: 'text-ink',
}

export function BrandMark({ className = 'h-9 w-9', tone = 'vida' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${className} ${tones[tone]}`}
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 38c8-14 16-14 24 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 28c4-6 8-6 12 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="32" cy="22" r="3" fill="currentColor" />
    </svg>
  )
}

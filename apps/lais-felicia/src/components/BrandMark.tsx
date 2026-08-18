type Props = {
  className?: string
  tone?: 'rose' | 'paper'
  showWordmark?: boolean
}

export function BrandMark({
  className = 'h-11 w-11',
  tone = 'rose',
  showWordmark = false,
}: Props) {
  const stroke = tone === 'paper' ? '#FBF6F7' : '#C9899A'
  const word = tone === 'paper' ? 'text-paper' : 'text-ink'

  return (
    <span className="inline-flex items-center gap-3">
      <svg viewBox="0 0 72 72" className={className} aria-hidden>
        <circle cx="36" cy="36" r="34" fill="none" stroke={stroke} strokeWidth="1.1" />
        <text
          x="36"
          y="44"
          textAnchor="middle"
          fill={stroke}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="26"
        >
          Lf
        </text>
      </svg>
      {showWordmark ? (
        <span className={`hidden leading-tight sm:block ${word}`}>
          <span className="block font-script text-[1.65rem] leading-none">Laís Felicia</span>
          <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.26em] opacity-70">
            Studio
          </span>
        </span>
      ) : null}
    </span>
  )
}

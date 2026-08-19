import { asset } from '../data/site'

type Props = {
  className?: string
  showWordmark?: boolean
  invert?: boolean
}

export function BrandMark({
  className = 'h-11 w-11',
  showWordmark = false,
  invert = false,
}: Props) {
  const word = invert ? 'text-paper' : 'text-ink'

  return (
    <span className="inline-flex items-center gap-3">
      <img
        src={asset('logo-256.png')}
        alt="Laís Felicia, designer de sobrancelhas"
        className={`${className} object-contain`}
        width={80}
        height={80}
      />
      {showWordmark ? (
        <span className={`hidden leading-tight sm:block ${word}`}>
          <span className="block text-[11px] font-medium uppercase tracking-[0.22em]">
            Laís Felicia
          </span>
          <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.22em] opacity-60">
            Sobrancelhas
          </span>
        </span>
      ) : null}
    </span>
  )
}

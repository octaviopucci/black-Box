import { asset } from '../data/site'

type Props = {
  className?: string
  showWordmark?: boolean
}

export function BrandMark({ className = 'h-10 w-10', showWordmark = false }: Props) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src={asset('brand/logo.png')}
        alt="G&L Locações de Brinquedos"
        className={`${className} rounded-full object-cover shadow-sun`}
        width={80}
        height={80}
      />
      {showWordmark ? (
        <span className="leading-tight">
          <span className="block font-brand text-xl font-bold tracking-tight text-paper sm:text-2xl">
            G&amp;L
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-sun">
            Locações
          </span>
        </span>
      ) : null}
    </span>
  )
}

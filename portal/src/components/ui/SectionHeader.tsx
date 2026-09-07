import { cn } from '../../lib/cn'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, subtitle, className, align = 'left' }: Props) {
  return (
    <header
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? <p className="bb-eyebrow mb-5">{eyebrow}</p> : null}
      <h2 className="bb-display text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">{subtitle}</p>
      ) : null}
    </header>
  )
}

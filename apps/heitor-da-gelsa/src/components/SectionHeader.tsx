import { Reveal } from './Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark' | 'green'
  className?: string
}

const eyebrowTheme = {
  light: 'text-green',
  dark: 'text-yellow',
  green: 'text-yellow',
}

const titleTheme = {
  light: 'text-green-deep',
  dark: 'text-white',
  green: 'text-white',
}

const descTheme = {
  light: 'text-mute',
  dark: 'text-white/70',
  green: 'text-white/75',
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  theme = 'light',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''

  return (
    <Reveal className={className}>
      <p className={`eyebrow ${eyebrowTheme[theme]}`}>{eyebrow}</p>
      <h2 className={`section-title mt-3 max-w-3xl ${titleTheme[theme]} ${alignClass}`}>{title}</h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${descTheme[theme]} ${alignClass}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}

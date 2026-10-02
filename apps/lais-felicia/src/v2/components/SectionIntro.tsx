type SectionIntroProps = {
  eyebrow: string
  title: string
  description?: string
  titleAs?: 'h2' | 'h3'
  titleClassName?: string
  className?: string
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  titleAs = 'h2',
  titleClassName = 'text-4xl sm:text-5xl',
  className = '',
}: SectionIntroProps) {
  const TitleTag = titleAs

  return (
    <div className={`section-intro mx-auto mb-12 max-w-3xl text-center ${className}`.trim()}>
      <p className="eyebrow">{eyebrow}</p>
      <TitleTag className={`display-title mt-3 ${titleClassName}`}>{title}</TitleTag>
      {description ? (
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}
    </div>
  )
}

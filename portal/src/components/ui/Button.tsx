import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'

const variants: Record<Variant, string> = {
  primary:
    'border border-paper/80 bg-paper text-ink hover:bg-silver hover:border-silver',
  secondary:
    'border border-white/15 bg-transparent text-paper hover:border-paper/50 hover:bg-white/[0.03]',
  ghost: 'border border-transparent bg-transparent text-silver hover:text-paper',
  link: 'border-0 bg-transparent p-0 text-paper underline-offset-4 hover:underline',
}

type Common = {
  children: ReactNode
  variant?: Variant
  className?: string
  arrow?: boolean
}

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = 'primary', className, arrow, ...rest } = props
  const classes = cn(
    'inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition duration-300',
    variants[variant],
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      {arrow ? <span aria-hidden="true">→</span> : null}
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}

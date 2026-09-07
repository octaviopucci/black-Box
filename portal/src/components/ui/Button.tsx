import { motion } from 'framer-motion'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'

const variants: Record<Variant, string> = {
  primary:
    'border border-paper/80 bg-paper text-ink hover:bg-silver hover:border-silver hover:shadow-[0_0_32px_rgba(255,255,255,0.12)]',
  secondary:
    'border border-white/15 bg-transparent text-paper hover:border-paper/50 hover:bg-white/[0.05]',
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

function MotionWrap({
  children,
  className,
  reduced,
}: {
  children: ReactNode
  className: string
  reduced: boolean
}) {
  if (reduced) return <span className={className}>{children}</span>
  return (
    <motion.span
      className={cn('inline-flex', className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    >
      {children}
    </motion.span>
  )
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const reduced = useReducedMotion()
  const { children, variant = 'primary', className, arrow, ...rest } = props
  const classes = cn(
    'inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition duration-300',
    variants[variant],
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      {arrow ? (
        <motion.span
          aria-hidden="true"
          className="inline-block"
          initial={false}
          whileHover={reduced ? undefined : { x: 4 }}
        >
          →
        </motion.span>
      ) : null}
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <MotionWrap reduced={reduced} className={classes}>
        <a href={href} className="inline-flex items-center justify-center gap-2" {...anchorRest}>
          {content}
        </a>
      </MotionWrap>
    )
  }

  return (
    <MotionWrap reduced={reduced} className={classes}>
      <button type="button" className="inline-flex items-center justify-center gap-2" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {content}
      </button>
    </MotionWrap>
  )
}

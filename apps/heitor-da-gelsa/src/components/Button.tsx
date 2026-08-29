import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-white'

interface ButtonProps {
  children: ReactNode
  href?: string
  to?: string
  variant?: ButtonVariant
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  external?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-yellow text-green-dark hover:bg-yellow-gold border border-yellow font-bold',
  secondary: 'bg-green text-white hover:bg-green-dark border border-green font-semibold',
  outline:
    'bg-transparent text-green border-2 border-green hover:bg-green hover:text-white font-semibold',
  'outline-white':
    'bg-transparent text-white border-2 border-white/80 hover:bg-white hover:text-green-deep font-semibold',
}

export function Button({
  children,
  href,
  to,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  external,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow sm:text-base'

  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

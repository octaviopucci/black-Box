export function GovLogo({
  className = '',
  markClassName = 'text-gov',
  lockup = true,
}: {
  className?: string
  markClassName?: string
  lockup?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        aria-hidden
        className="shrink-0"
      >
        <rect width="36" height="36" rx="4" className="fill-gov" />
        <path
          d="M18 7.5 28 13.2v9.6L18 28.5 8 22.8v-9.6L18 7.5Z"
          fill="none"
          stroke="#FFDF00"
          strokeWidth="1.6"
        />
        <circle cx="18" cy="18" r="3.2" fill="#009C3B" />
      </svg>
      <span className="leading-none">
        <span className={`block text-[1.65rem] font-extrabold tracking-tight ${markClassName}`}>
          gov.br
        </span>
        {lockup && (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
            Governo Federal
          </span>
        )}
      </span>
    </span>
  )
}

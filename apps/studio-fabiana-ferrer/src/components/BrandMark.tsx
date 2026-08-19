import { motion } from 'framer-motion'

export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`inline-flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-forest shadow-glow">
        <span className="absolute inset-1 rounded-[0.65rem] bg-gradient-to-br from-leaf/30 to-transparent" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-paper" aria-hidden>
          <path
            fill="currentColor"
            d="M12 4a3 3 0 0 0-3 3v1.5A6 6 0 0 0 6 13.5C6 17.1 8.9 20 12.5 20h-.5c3.6 0 6.5-2.9 6.5-6.5a6 6 0 0 0-3-5.2V7a3 3 0 0 0-3-3Z"
            opacity="0.9"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-medium tracking-tight text-forest">
          Fabiana Ferrer
        </span>
        <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-mark text-sage">
          Laser e Estética
        </span>
      </span>
    </motion.div>
  )
}

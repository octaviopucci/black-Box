import { motion } from 'framer-motion'
import { bookingUrl } from '../data/site'

export function PulseBooking() {
  return (
    <motion.a
      href={bookingUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Agendar consulta"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-signal px-5 py-3.5 text-sm font-semibold text-void shadow-glow"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-void/35 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-void" />
      </span>
      Agendar
    </motion.a>
  )
}

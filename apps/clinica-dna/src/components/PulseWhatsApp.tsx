import { motion } from 'framer-motion'
import { whatsappUrl } from '../data/site'

/** Brand-colored float CTA — signal aqua, not generic WhatsApp green. */
export function PulseWhatsApp() {
  return (
    <motion.a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Agendar no WhatsApp — Clínica DNA"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-50 flex h-12 items-center gap-2.5 rounded-full bg-signal pl-4 pr-5 text-sm font-semibold text-void shadow-soft ring-1 ring-mist/40"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-void/35 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-void/80" />
      </span>
      Agendar
    </motion.a>
  )
}

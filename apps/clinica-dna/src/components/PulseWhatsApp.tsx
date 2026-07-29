import { motion } from 'framer-motion'
import { whatsappUrl } from '../data/site'

export function PulseWhatsApp() {
  return (
    <motion.a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Clínica DNA"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 text-sm font-semibold text-white shadow-soft"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      Agendar
    </motion.a>
  )
}

import { motion } from 'framer-motion'
import { brand } from '@/data/site'

export default function PulseInstagram() {
  return (
    <motion.a
      href={brand.instagramDm}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar pelo Instagram"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-semibold text-paper shadow-lift md:bottom-8 md:right-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
      </span>
      Instagram
    </motion.a>
  )
}

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.8 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lift sm:bottom-7 sm:right-7"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  )
}

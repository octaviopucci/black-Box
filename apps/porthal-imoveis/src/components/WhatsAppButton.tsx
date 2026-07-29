import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-soft transition hover:scale-105 hover:bg-[#0f7a6e]"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  )
}

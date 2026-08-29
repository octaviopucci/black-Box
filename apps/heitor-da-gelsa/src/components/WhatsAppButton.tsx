import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/data/site'

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    const onScroll = () => {
      if (window.scrollY > 400) setVisible(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale com Heitor no WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg transition-transform hover:scale-105 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <MessageCircle size={28} aria-hidden />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

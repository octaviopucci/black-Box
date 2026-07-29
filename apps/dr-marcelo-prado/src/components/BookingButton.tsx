import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { bookingUrl } from '../data/site'

export function BookingButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={bookingUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-aqua px-5 py-3.5 text-sm font-bold text-snow shadow-glow transition-all duration-500 hover:bg-aqua-soft sm:bottom-8 sm:right-8 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      aria-label="Agendar consulta"
    >
      Agendar
      <ArrowUpRight className="h-4 w-4" />
    </a>
  )
}

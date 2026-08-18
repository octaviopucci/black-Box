import { whatsappUrl } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] py-2 pl-2 pr-4 text-white shadow-lg sm:bottom-7 sm:left-7"
      aria-label="Agendar no WhatsApp"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15" aria-hidden>
        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
          <path d="M19.11 17.27c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.16.24-.64.8-.78.96-.14.16-.28.18-.53.06-.25-.12-1.03-.38-1.95-1.2-.72-.65-1.2-1.45-1.34-1.69-.14-.24-.01-.37.1-.49.1-.1.25-.27.37-.4.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.73 2.64 4.19 3.7.58.25 1.03.39 1.38.5.58.18 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.08.14-1.18-.06-.09-.22-.15-.47-.27z" />
          <path d="M16.02 3.5c-6.92 0-12.53 5.6-12.53 12.5 0 2.2.58 4.36 1.67 6.25L3.5 28.5l6.4-1.63a12.5 12.5 0 006.12 1.6h.01c6.9 0 12.5-5.6 12.5-12.5S22.92 3.5 16.02 3.5zm0 22.83h-.01a10.3 10.3 0 01-5.24-1.43l-.37-.22-3.8.97 1.01-3.7-.24-.38a10.3 10.3 0 01-1.58-5.5c0-5.7 4.64-10.33 10.34-10.33 2.76 0 5.35 1.08 7.3 3.03a10.26 10.26 0 013.01 7.29c0 5.7-4.64 10.34-10.33 10.34z" />
        </svg>
      </span>
      <span className="pr-1 text-xs font-display font-bold uppercase tracking-[0.12em]">
        Agendar no WhatsApp
      </span>
    </a>
  )
}

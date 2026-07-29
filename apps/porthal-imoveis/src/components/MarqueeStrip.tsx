import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const phrases = [
  'Imóvel moeda forte',
  'Capão Bonito & região',
  'Valores à vista claros',
  'Sítios · Casas · Comercial',
  'Atendimento especializado',
]

export function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })
    }, track)
    return () => ctx.revert()
  }, [])

  const content = [...phrases, ...phrases]

  return (
    <div className="overflow-hidden border-y border-line bg-white/50 py-4">
      <div ref={trackRef} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
        {content.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="inline-flex items-center gap-10 text-sm font-medium uppercase tracking-[0.22em] text-mute"
          >
            {phrase}
            <span className="h-1 w-1 rounded-full bg-brand" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

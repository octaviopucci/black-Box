import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 48,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [delay, once, y])

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

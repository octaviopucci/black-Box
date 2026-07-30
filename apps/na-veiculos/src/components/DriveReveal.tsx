import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion } from '../hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  children: React.ReactNode
  className?: string
}

export function DriveReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 48, clipPath: 'inset(12% 0 0 0)' },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

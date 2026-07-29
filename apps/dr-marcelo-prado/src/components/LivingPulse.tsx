import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LivingPulse() {
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const glow = glowRef.current
    if (!path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.strokeDashoffset = '0'
      return
    }

    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.55,
        onUpdate: (self) => {
          if (!glow) return
          const p = path.getPointAtLength(self.progress * length)
          gsap.set(glow, { attr: { cx: p.x, cy: p.y } })
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-[min(6vw,64px)] z-20 hidden h-full w-20 md:block"
      viewBox="0 0 80 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FB8B9" stopOpacity="0.12" />
          <stop offset="40%" stopColor="#6FB8B9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9B8A4" stopOpacity="0.55" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M40 0 C 10 80, 70 160, 40 240 S 10 400, 40 480 S 70 640, 40 720 S 10 880, 40 1000"
        fill="none"
        stroke="rgba(111,184,185,0.12)"
        strokeWidth="1"
      />
      <path
        ref={pathRef}
        d="M40 0 C 10 80, 70 160, 40 240 S 10 400, 40 480 S 70 640, 40 720 S 10 880, 40 1000"
        fill="none"
        stroke="url(#pulseGlow)"
        strokeWidth="1.7"
        strokeLinecap="round"
        filter="url(#softGlow)"
      />
      <circle ref={glowRef} r="3.2" fill="#6FB8B9" opacity="0.85" />
    </svg>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Calibration pulse — narrative spine drawn with scroll. */
export function LivingPulse() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
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
        scrub: 0.6,
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
      className="pointer-events-none fixed inset-y-0 left-[min(8vw,72px)] z-20 hidden h-full w-24 md:block"
      viewBox="0 0 80 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7EC8C9" stopOpacity="0.15" />
          <stop offset="45%" stopColor="#7EC8C9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4C4B0" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M40 0 C 10 80, 70 160, 40 240 S 10 400, 40 480 S 70 640, 40 720 S 10 880, 40 1000"
        fill="none"
        stroke="url(#pulseGlow)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

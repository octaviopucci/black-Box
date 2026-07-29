import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Continuous luminous thread that draws with scroll — the site's narrative spine. */
export function LivingThread() {
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

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
      ref={svgRef}
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-[min(8vw,72px)] z-20 hidden h-full w-24 md:block"
      viewBox="0 0 80 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="threadGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8D4E8" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#A8D4E8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E8D5C4" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M40 0 C 10 80, 70 160, 40 240 S 10 400, 40 480 S 70 640, 40 720 S 10 880, 40 1000"
        fill="none"
        stroke="url(#threadGlow)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Decorative needle-line that draws as the page is explored. */
export function NeedleRail() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 1023px)').matches) return

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
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-6 top-0 z-40 hidden w-px lg:block"
    >
      <svg
        className="h-full w-8 -translate-x-1/2 overflow-visible"
        viewBox="0 0 8 1000"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M4 0 C4 120 4 180 4 300 S4 480 4 560 S4 780 4 1000"
          fill="none"
          stroke="#B8956A"
          strokeWidth="1.25"
          opacity="0.55"
        />
      </svg>
    </div>
  )
}

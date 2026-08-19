import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Options = {
  enabled?: boolean
  scrub?: number
  scrollVh?: number
}

export function useScrollVideoScrub(
  sectionRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true, scrub = 0.4, scrollVh = 300 }: Options = {},
) {
  useEffect(() => {
    if (!enabled) return

    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    let trigger: ScrollTrigger | undefined

    const ctx = gsap.context(() => {
      const bind = () => {
        trigger?.kill()
        if (!video.duration || Number.isNaN(video.duration)) return

        trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub,
          onUpdate: (self) => {
            const target = self.progress * video.duration
            if (Math.abs(video.currentTime - target) > 0.04) {
              video.currentTime = target
            }
          },
        })
      }

      if (video.readyState >= 1) bind()
      else video.addEventListener('loadedmetadata', bind, { once: true })
    }, section)

    return () => {
      trigger?.kill()
      ctx.revert()
    }
  }, [enabled, scrub, scrollVh, sectionRef, videoRef])
}

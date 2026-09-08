import { useEffect, useState, type RefObject } from 'react'

type VideoScrubOptions = {
  enabled?: boolean
  videoSrc: string
  scrub?: number | boolean
  scrollLength?: number
}

export function useScrollVideoScrub(
  sectionRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true, videoSrc, scrub = 0.45, scrollLength = 2.2 }: VideoScrubOptions,
) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled || !videoSrc) return

    const section = sectionRef.current
    const pin = pinRef.current
    const video = videoRef.current
    if (!section || !pin || !video) return

    let cancelled = false
    let trigger: { kill: () => void; progress: number } | undefined
    let ctxRevert: (() => void) | undefined

    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = videoSrc
    video.load()

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const bind = () => {
          if (!video.duration || Number.isNaN(video.duration)) return
          trigger?.kill()

          trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * scrollLength}`,
            pin,
            pinSpacing: false,
            scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const target = Math.min(
                Math.max(self.progress * video.duration, 0),
                Math.max(video.duration - 0.05, 0),
              )
              if (Math.abs(video.currentTime - target) > 0.025) {
                video.currentTime = target
              }
            },
          })

          ScrollTrigger.refresh()

          const target = Math.min(
            Math.max(trigger.progress * video.duration, 0),
            Math.max(video.duration - 0.05, 0),
          )
          video.currentTime = target
          setReady(true)
        }

        const onReady = () => {
          video.pause()
          bind()
        }

        if (video.readyState >= 2) onReady()
        else video.addEventListener('loadeddata', onReady, { once: true })

        const refresh = () => {
          if (trigger) ScrollTrigger.refresh()
        }
        window.addEventListener('load', refresh)
        const refreshTimer = window.setTimeout(refresh, 800)

        return () => {
          window.removeEventListener('load', refresh)
          window.clearTimeout(refreshTimer)
        }
      }, section)

      ctxRevert = () => ctx.revert()
    }

    void boot()

    return () => {
      cancelled = true
      setReady(false)
      trigger?.kill()
      ctxRevert?.()
    }
  }, [enabled, pinRef, scrub, scrollLength, sectionRef, videoRef, videoSrc])

  return ready
}

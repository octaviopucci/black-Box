import { useEffect, useState, type RefObject } from 'react'

type VideoScrubOptions = {
  enabled?: boolean
  videoSrc: string
  scrub?: number | boolean
  scrollLength?: number
  /** Wait for scroll/touch before loading GSAP + video (faster first paint). */
  deferUntilInteraction?: boolean
}

function useScrubArmed(deferUntilInteraction: boolean, enabled: boolean) {
  const [armed, setArmed] = useState(!deferUntilInteraction || !enabled)

  useEffect(() => {
    if (!enabled || !deferUntilInteraction || armed) return

    const arm = () => setArmed(true)

    window.addEventListener('wheel', arm, { once: true, passive: true })
    window.addEventListener('touchstart', arm, { once: true, passive: true })
    window.addEventListener('scroll', arm, { once: true, passive: true })

    let idleId: ReturnType<typeof setTimeout> | undefined
    let ricId: number | undefined

    if ('requestIdleCallback' in window) {
      ricId = window.requestIdleCallback(arm, { timeout: 5000 })
    } else {
      idleId = setTimeout(arm, 5000)
    }

    return () => {
      window.removeEventListener('wheel', arm)
      window.removeEventListener('touchstart', arm)
      window.removeEventListener('scroll', arm)
      if (ricId !== undefined) window.cancelIdleCallback(ricId)
      if (idleId !== undefined) clearTimeout(idleId)
    }
  }, [armed, deferUntilInteraction, enabled])

  return armed
}

export function useScrollVideoScrub(
  sectionRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  {
    enabled = true,
    videoSrc,
    scrub = 0.45,
    scrollLength = 2.2,
    deferUntilInteraction = true,
  }: VideoScrubOptions,
) {
  const armed = useScrubArmed(deferUntilInteraction, enabled)

  useEffect(() => {
    if (!enabled || !armed || !videoSrc) return

    const section = sectionRef.current
    const pin = pinRef.current
    const video = videoRef.current
    if (!section || !pin || !video) return

    let cancelled = false
    let trigger: { kill: () => void } | undefined
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
            pinSpacing: true,
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
        }

        const onReady = () => {
          video.pause()
          video.currentTime = 0
          bind()
        }

        if (video.readyState >= 2) onReady()
        else video.addEventListener('loadeddata', onReady, { once: true })

        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener('load', refresh)
        const refreshTimer = window.setTimeout(refresh, 1200)

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
      trigger?.kill()
      ctxRevert?.()
    }
  }, [armed, enabled, pinRef, scrub, scrollLength, sectionRef, videoRef, videoSrc])
}

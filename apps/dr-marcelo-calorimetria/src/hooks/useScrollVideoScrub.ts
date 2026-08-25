import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type VideoScrubOptions = {
  enabled?: boolean
  scrub?: number
  scrollLength?: number
}

export function useScrollVideoScrub(
  sectionRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true, scrub = 0.45, scrollLength = 2.2 }: VideoScrubOptions = {},
) {
  useEffect(() => {
    if (!enabled) return

    const section = sectionRef.current
    const pin = pinRef.current
    const video = videoRef.current
    if (!section || !pin || !video) return

    video.muted = true
    video.playsInline = true
    video.pause()
    video.load()

    let trigger: ScrollTrigger | undefined
    let ready = false

    const ctx = gsap.context(() => {
      const bind = () => {
        if (!video.duration || Number.isNaN(video.duration)) return
        ready = true
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

      const refresh = () => {
        if (ready) ScrollTrigger.refresh()
      }
      window.addEventListener('load', refresh)
      const refreshTimer = window.setTimeout(refresh, 1500)

      return () => {
        window.removeEventListener('load', refresh)
        window.clearTimeout(refreshTimer)
      }
    }, section)

    return () => {
      trigger?.kill()
      ctx.revert()
    }
  }, [enabled, pinRef, scrub, scrollLength, sectionRef, videoRef])
}

type FrameScrubOptions = {
  enabled?: boolean
  scrub?: number
  scrollLength?: number
  frames: string[]
}

export function useScrollFrameScrub(
  sectionRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  frameRef: RefObject<HTMLImageElement | null>,
  { enabled = true, scrub = 0.45, scrollLength = 2, frames }: FrameScrubOptions,
) {
  useEffect(() => {
    if (!enabled || frames.length === 0) return

    const section = sectionRef.current
    const pin = pinRef.current
    const img = frameRef.current
    if (!section || !pin || !img) return

    let trigger: ScrollTrigger | undefined

    const ctx = gsap.context(() => {
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
          const idx = Math.min(
            Math.round(self.progress * (frames.length - 1)),
            frames.length - 1,
          )
          const next = frames[idx]
          if (next && img.getAttribute('src') !== next) {
            img.src = next
          }
        },
      })

      ScrollTrigger.refresh()
    }, section)

    return () => {
      trigger?.kill()
      ctx.revert()
    }
  }, [enabled, frames, pinRef, scrub, scrollLength, sectionRef, frameRef])
}

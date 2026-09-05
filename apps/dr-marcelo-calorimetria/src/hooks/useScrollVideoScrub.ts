import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type VideoScrubOptions = {
  enabled?: boolean
  scrub?: number | boolean
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
  scrub?: number | boolean
  scrollLength?: number
  frames: string[]
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = img.naturalWidth / img.naturalHeight
  const canvasRatio = width / height

  let sourceX = 0
  let sourceY = 0
  let sourceW = img.naturalWidth
  let sourceH = img.naturalHeight

  if (imageRatio > canvasRatio) {
    sourceW = img.naturalHeight * canvasRatio
    sourceX = (img.naturalWidth - sourceW) / 2
  } else {
    sourceH = img.naturalWidth / canvasRatio
    sourceY = (img.naturalHeight - sourceH) / 2
  }

  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, width, height)
}

export function useScrollFrameScrub(
  sectionRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { enabled = true, scrub = 0.15, scrollLength = 1.8, frames }: FrameScrubOptions,
) {
  useEffect(() => {
    if (!enabled || frames.length === 0) return

    const section = sectionRef.current
    const pin = pinRef.current
    const canvas = canvasRef.current
    if (!section || !pin || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let trigger: ScrollTrigger | undefined
    let cancelled = false
    let currentIdx = -1

    const images: HTMLImageElement[] = frames.map((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      return img
    })

    const drawFrame = (idx: number) => {
      const img = images[idx]
      if (!img?.complete) return
      const { width, height } = canvas.getBoundingClientRect()
      if (canvas.width === 0 || canvas.height === 0) resizeCanvas()
      drawCover(ctx, img, width, height)
      currentIdx = idx
    }

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (currentIdx >= 0) {
        const img = images[currentIdx]
        if (img?.complete) drawCover(ctx, img, width, height)
      }
    }

    const bind = () => {
      if (cancelled) return
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
          const idx = Math.min(
            Math.round(self.progress * (frames.length - 1)),
            frames.length - 1,
          )
          if (idx !== currentIdx) drawFrame(idx)
        },
      })

      drawFrame(0)
      ScrollTrigger.refresh()
    }

    Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve()
            else {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            }
          }),
      ),
    ).then(() => {
      if (!cancelled) bind()
    })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      cancelled = true
      window.removeEventListener('resize', resizeCanvas)
      trigger?.kill()
    }
  }, [enabled, frames, pinRef, scrub, scrollLength, sectionRef, canvasRef])
}

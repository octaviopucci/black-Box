# Scroll-scrubbed video (React + GSAP)

Use when the brief needs a full-bleed video whose playback head follows scroll.

## Markup sketch

```tsx
<section ref={sectionRef} className="relative h-[300vh] bg-ink">
  <div className="sticky top-0 h-[100svh] overflow-hidden">
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={videoSrc}
      poster={posterSrc}
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/50" />
    <div className="relative z-10 flex h-full max-w-7xl flex-col justify-end px-5 pb-16">
      {/* brand + one line + CTA — keep hero budget tight */}
    </div>
  </div>
</section>
```

## Scrub effect

```tsx
useEffect(() => {
  const section = sectionRef.current
  const video = videoRef.current
  if (!section || !video) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause()
    video.currentTime = 0
    return
  }

  const ctx = gsap.context(() => {
    const startScrub = () => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          if (!video.duration) return
          video.currentTime = self.progress * video.duration
        },
      })
    }

    if (video.readyState >= 1) startScrub()
    else video.addEventListener('loadedmetadata', startScrub, { once: true })
  }, section)

  return () => ctx.revert()
}, [])
```

## Asset guidance

- Export progressive MP4 (H.264 + AAC or muted without audio track).
- Prefer 1920×1080 or less; test 1280×720 on mobile-heavy landings.
- Keep motion readable at scrub speeds (avoid 1-frame flashes).
- Provide `poster` matching the first meaningful frame.

## Fallback

If no video asset exists yet: ship a full-bleed photo hero with Pattern C parallax from the parent skill, and keep the same DOM slots (`data-video-slot`) so the scrub can be dropped in later.

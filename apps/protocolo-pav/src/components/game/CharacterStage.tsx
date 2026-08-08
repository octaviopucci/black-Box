import { useEffect, useRef } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { drawWillCharacter, type CharacterPose } from './WillCharacter'

type Props = {
  pose?: CharacterPose
  className?: string
  label?: string
}

export function CharacterStage({ pose = 'idle', className = '', label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let alive = true
    const t0 = performance.now()

    const render = (now: number) => {
      if (!alive) return
      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      ctx.clearRect(0, 0, width, height)

      // arena floor plane
      const grd = ctx.createLinearGradient(0, height * 0.55, 0, height)
      grd.addColorStop(0, 'rgba(225,6,0,0.0)')
      grd.addColorStop(0.4, 'rgba(225,6,0,0.08)')
      grd.addColorStop(1, 'rgba(5,5,5,0.9)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      // perspective lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const y = height * 0.58 + i * 18
        ctx.beginPath()
        ctx.moveTo(width * 0.1, y)
        ctx.lineTo(width * 0.9, y)
        ctx.stroke()
      }

      const t = (now - t0) / 1000
      drawWillCharacter(ctx, {
        x: width * 0.5,
        y: height * 0.62,
        facing: 1,
        pose,
        t,
        scale: Math.min(width, height) / 220,
      })

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    const onResize = () => {
      /* next frame resizes */
    }
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [pose])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={ref} className="h-full w-full" aria-label={label ?? 'Personagem da Arena'} />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 scanlines" />
    </div>
  )
}

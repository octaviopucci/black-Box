import { useEffect, useRef } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { drawWillCharacter, type CharacterPose } from './WillCharacter'

type Props = {
  pose?: CharacterPose
  className?: string
  label?: string
  /** 0 = left, 0.5 = center, 1 = right */
  alignX?: number
  showFloor?: boolean
  scaleBoost?: number
}

export function CharacterStage({
  pose = 'idle',
  className = '',
  label,
  alignX = 0.5,
  showFloor = true,
  scaleBoost = 1,
}: Props) {
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
      if (rect.width < 2 || rect.height < 2) {
        raf = requestAnimationFrame(render)
        return
      }
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      ctx.clearRect(0, 0, width, height)

      if (showFloor) {
        const grd = ctx.createLinearGradient(0, height * 0.55, 0, height)
        grd.addColorStop(0, 'rgba(225,6,0,0.0)')
        grd.addColorStop(0.4, 'rgba(225,6,0,0.08)')
        grd.addColorStop(1, 'rgba(5,5,5,0.9)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 1
        for (let i = 0; i < 8; i++) {
          const y = height * 0.58 + i * 18
          ctx.beginPath()
          ctx.moveTo(width * 0.1, y)
          ctx.lineTo(width * 0.9, y)
          ctx.stroke()
        }
      } else {
        // subtle stage glow behind character
        const glowX = width * alignX
        const glow = ctx.createRadialGradient(glowX, height * 0.55, 10, glowX, height * 0.55, width * 0.42)
        glow.addColorStop(0, 'rgba(225,6,0,0.22)')
        glow.addColorStop(0.45, 'rgba(46,229,157,0.08)')
        glow.addColorStop(1, 'rgba(5,5,5,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)
      }

      const t = (now - t0) / 1000
      const baseScale = Math.min(width, height) / 200
      drawWillCharacter(ctx, {
        x: width * alignX,
        y: height * 0.64,
        facing: 1,
        pose,
        t,
        scale: baseScale * scaleBoost,
      })

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [pose, alignX, showFloor, scaleBoost])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={ref} className="h-full w-full" aria-label={label ?? 'Personagem da Arena'} />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 scanlines" />
    </div>
  )
}

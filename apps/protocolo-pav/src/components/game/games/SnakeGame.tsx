import { useEffect, useRef, useState } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { GameShell } from '../GameShell'

type Props = { onFinish: (score: number, xp: number) => void }
type Pt = { x: number; y: number }

export function SnakeGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('jogando')
  const done = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    done.current = false
    const cols = 24
    const rows = 16
    let dir: Pt = { x: 1, y: 0 }
    let pending: Pt | null = null
    let snake: Pt[] = [
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 4, y: 8 },
    ]
    let food: Pt = { x: 14, y: 8 }
    let acc = 0
    let scoreLocal = 0
    let raf = 0
    let running = true
    let last = performance.now()
    let time = 45

    const placeFood = () => {
      for (let i = 0; i < 80; i++) {
        const p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }
        if (!snake.some((s) => s.x === p.x && s.y === p.y)) {
          food = p
          return
        }
      }
    }

    const end = (label: string) => {
      if (done.current) return
      done.current = true
      setStatus(label)
      onFinishRef.current(scoreLocal, Math.max(10, Math.round(scoreLocal / 2) + 8))
    }

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }
      const n = map[e.key]
      if (!n) return
      e.preventDefault()
      if (n.x === -dir.x && n.y === -dir.y) return
      pending = n
    }

    let touchStart: Pt | null = null
    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      touchStart = { x: t.clientX, y: t.clientY }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStart.x
      const dy = t.clientY - touchStart.y
      if (Math.abs(dx) + Math.abs(dy) < 18) return
      const n = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) }
      if (n.x === -dir.x && n.y === -dir.y) return
      pending = n
    }

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      const cell = Math.min(width / cols, height / rows)
      const ox = (width - cell * cols) / 2
      const oy = (height - cell * rows) / 2

      if (!done.current) {
        time -= dt
        acc += dt
        const step = Math.max(0.09, 0.16 - scoreLocal * 0.002)
        if (acc >= step) {
          acc = 0
          if (pending) {
            dir = pending
            pending = null
          }
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
          if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some((p) => p.x === head.x && p.y === head.y)) {
            end('bateu')
          } else {
            snake.unshift(head)
            if (head.x === food.x && head.y === food.y) {
              scoreLocal += 10
              setScore(scoreLocal)
              placeFood()
            } else {
              snake.pop()
            }
          }
        }
        if (time <= 0) end('tempo')
      }

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#070707'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath()
        ctx.moveTo(ox + x * cell, oy)
        ctx.lineTo(ox + x * cell, oy + rows * cell)
        ctx.stroke()
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath()
        ctx.moveTo(ox, oy + y * cell)
        ctx.lineTo(ox + cols * cell, oy + y * cell)
        ctx.stroke()
      }

      ctx.fillStyle = '#E10600'
      ctx.beginPath()
      ctx.arc(ox + food.x * cell + cell / 2, oy + food.y * cell + cell / 2, cell * 0.32, 0, Math.PI * 2)
      ctx.fill()

      snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? '#2EE59D' : `rgba(46,229,157,${0.35 + (1 - i / snake.length) * 0.5})`
        ctx.fillRect(ox + p.x * cell + 2, oy + p.y * cell + 2, cell - 4, cell - 4)
      })

      ctx.fillStyle = '#C9C9C9'
      ctx.font = '600 12px "IBM Plex Mono", monospace'
      ctx.fillText(`${Math.max(0, Math.ceil(time))}s`, 16, 24)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <GameShell
      title="Cobra"
      subtitle="Setas / WASD / swipe"
      hud={`${score}`}
      footer={
        <p className="text-center text-xs text-ash">
          Ritmo repetitivo que acalma o impulso. Status: {status}.
        </p>
      }
    >
      <canvas ref={canvasRef} className="h-full min-h-[55vh] w-full touch-none" />
    </GameShell>
  )
}

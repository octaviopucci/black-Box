import { useEffect, useRef, useState } from 'react'
import { rand, setupHiDPICanvas } from '@/lib/canvas'
import { drawWillCharacter } from '../WillCharacter'
import { GameShell } from '../GameShell'

type Obstacle = { x: number; w: number; h: number; kind: 'spike' | 'block' | 'wave' }

type Props = { onFinish: (score: number, xp: number) => void }

export function RunnerGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const jumpRef = useRef<(() => void) | null>(null)
  const [score, setScore] = useState(0)
  const [alive, setAlive] = useState(true)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const s = {
      t: 0,
      speed: 280,
      groundY: 0,
      x: 90,
      y: 0,
      vy: 0,
      onGround: true,
      obstacles: [] as Obstacle[],
      spawn: 0.8,
      score: 0,
      timeLeft: 60,
      hitFlash: 0,
      jumping: false,
      ended: false,
      alive: true,
    }

    let raf = 0
    let running = true
    let last = performance.now()

    const finish = (stillAlive: boolean) => {
      if (s.ended) return
      s.ended = true
      s.alive = stillAlive
      setEnded(true)
      setAlive(stillAlive)
      const xp = stillAlive
        ? Math.max(20, Math.round(s.score / 3) + 25)
        : Math.max(8, Math.round(s.score / 4))
      onFinishRef.current(Math.round(s.score), xp)
    }

    const jump = () => {
      if (s.onGround && !s.ended) {
        s.vy = -620
        s.onGround = false
        s.jumping = true
      }
    }
    jumpRef.current = jump

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        jump()
      }
    }
    const onPointer = () => jump()

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('pointerdown', onPointer)

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      s.groundY = height * 0.78
      s.t += dt
      s.hitFlash = Math.max(0, s.hitFlash - dt)

      if (!s.ended) {
        s.timeLeft -= dt
        s.speed = 280 + Math.min(220, s.score * 1.8)
        s.vy += 1800 * dt
        s.y += s.vy * dt
        if (s.y >= 0) {
          s.y = 0
          s.vy = 0
          s.onGround = true
          s.jumping = false
        }

        s.spawn -= dt
        if (s.spawn <= 0) {
          const kind = (['spike', 'block', 'wave'] as const)[Math.floor(rand(0, 3))]
          s.obstacles.push({
            x: width + 40,
            w: kind === 'wave' ? 46 : kind === 'block' ? 36 : 28,
            h: kind === 'wave' ? 54 : kind === 'block' ? 42 : 34,
            kind,
          })
          s.spawn = rand(0.85, 1.55) - Math.min(0.45, s.score / 220)
        }

        for (const o of s.obstacles) o.x -= s.speed * dt
        s.obstacles = s.obstacles.filter((o) => o.x > -80)

        const px = Math.max(70, width * 0.14)
        const hitW = 34
        const hitH = 72
        const py = s.groundY + s.y - hitH
        for (const o of s.obstacles) {
          const ox = o.x
          const oy = s.groundY - o.h
          if (px + hitW * 0.35 > ox && px - hitW * 0.35 < ox + o.w && py + hitH > oy && py + 16 < s.groundY) {
            s.hitFlash = 0.35
            finish(false)
            break
          }
        }

        if (!s.ended) {
          if (s.timeLeft <= 0) {
            finish(true)
          } else {
            s.score += dt * (10 + s.speed / 80)
            setScore(Math.round(s.score))
          }
        }
      }

      ctx.clearRect(0, 0, width, height)
      const sky = ctx.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#1a0606')
      sky.addColorStop(0.4, '#0c0808')
      sky.addColorStop(1, '#050505')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, width, height)

      // far city silhouettes
      const scroll = (s.t * s.speed * 0.15) % 220
      ctx.fillStyle = '#120909'
      for (let i = -1; i < width / 80 + 2; i++) {
        const bx = i * 80 - scroll
        const bh = 40 + ((i * 37) % 90)
        ctx.fillRect(bx, s.groundY - bh - 40, 54, bh)
      }

      // neon perspective rails
      ctx.strokeStyle = 'rgba(225,6,0,0.18)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < 10; i++) {
        const x = ((s.t * 140 + i * 110) % (width + 110)) - 55
        ctx.beginPath()
        ctx.moveTo(x, height * 0.15)
        ctx.lineTo(x + 70, s.groundY)
        ctx.stroke()
      }

      // ground slab
      const groundGrad = ctx.createLinearGradient(0, s.groundY, 0, height)
      groundGrad.addColorStop(0, '#171111')
      groundGrad.addColorStop(1, '#050505')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, s.groundY, width, height - s.groundY)
      ctx.fillStyle = '#E10600'
      ctx.fillRect(0, s.groundY, width, 4)
      ctx.fillStyle = 'rgba(46,229,157,0.45)'
      ctx.fillRect(0, s.groundY + 4, width, 2)
      // lane markers
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      for (let i = 0; i < 12; i++) {
        const lx = ((s.t * s.speed + i * 90) % (width + 90)) - 40
        ctx.fillRect(lx, s.groundY + 18, 36, 3)
      }

      for (const o of s.obstacles) {
        if (o.kind === 'spike') {
          const g = ctx.createLinearGradient(o.x, s.groundY - o.h, o.x, s.groundY)
          g.addColorStop(0, '#FF2A1F')
          g.addColorStop(1, '#7a0400')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.moveTo(o.x, s.groundY)
          ctx.lineTo(o.x + o.w / 2, s.groundY - o.h)
          ctx.lineTo(o.x + o.w, s.groundY)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'
          ctx.stroke()
        } else if (o.kind === 'block') {
          ctx.fillStyle = '#2a1010'
          ctx.fillRect(o.x, s.groundY - o.h, o.w, o.h)
          ctx.strokeStyle = '#E10600'
          ctx.lineWidth = 2
          ctx.strokeRect(o.x, s.groundY - o.h, o.w, o.h)
          ctx.fillStyle = 'rgba(225,6,0,0.25)'
          ctx.fillRect(o.x + 6, s.groundY - o.h + 8, o.w - 12, 6)
        } else {
          const cx = o.x + o.w / 2
          const cy = s.groundY - o.h / 2
          const rg = ctx.createRadialGradient(cx, cy, 4, cx, cy, o.w * 0.7)
          rg.addColorStop(0, 'rgba(255,80,60,0.7)')
          rg.addColorStop(1, 'rgba(225,6,0,0.05)')
          ctx.fillStyle = rg
          ctx.beginPath()
          ctx.ellipse(cx, cy, o.w * 0.7, o.h * 0.55, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#FF2A1F'
          ctx.stroke()
        }
      }

      const pose = !s.alive ? 'hit' : s.jumping ? 'jump' : 'run'
      const charScale = Math.max(2.1, Math.min(width, height) / 280)
      drawWillCharacter(ctx, {
        x: Math.max(70, width * 0.14),
        y: s.groundY + s.y - 56 * charScale,
        facing: 1,
        pose,
        t: s.t,
        scale: charScale,
      })

      if (s.hitFlash > 0) {
        ctx.fillStyle = `rgba(225,6,0,${0.25 * s.hitFlash})`
        ctx.fillRect(0, 0, width, height)
      }

      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = '600 12px "IBM Plex Mono", monospace'
      ctx.fillText(`TEMPO ${Math.max(0, Math.ceil(s.timeLeft))}s`, 16, 28)
      ctx.fillStyle = '#2EE59D'
      ctx.fillText(`DIST ${Math.round(s.score)}`, 16, 48)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      running = false
      jumpRef.current = null
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return (
    <GameShell
      title="Runner"
      subtitle="Toque o botão ou a tela para pular"
      hud={`+${score}`}
      footer={
        <div className="mx-auto w-full max-w-lg space-y-2">
          {ended ? (
            <p className="text-center font-mono text-xs text-mist">
              {alive ? 'Onda atravessada.' : 'Impulso te alcançou.'} XP registrado.
            </p>
          ) : (
            <p className="text-center text-xs text-ash">
              Desvie do impulso. Celular: toque PULAR · PC: espaço
            </p>
          )}
          {!ended ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault()
                jumpRef.current?.()
              }}
              className="flex min-h-14 w-full select-none items-center justify-center rounded-2xl bg-signal font-display text-base font-bold uppercase tracking-[0.16em] text-white active:scale-[0.99] active:bg-signalHot"
              style={{ touchAction: 'none' }}
            >
              Pular
            </button>
          ) : null}
        </div>
      }
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ touchAction: 'none' }}
      />
    </GameShell>
  )
}

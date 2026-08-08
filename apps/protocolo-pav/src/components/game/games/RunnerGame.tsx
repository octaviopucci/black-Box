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

        const px = s.x
        const py = s.groundY + s.y - 48
        for (const o of s.obstacles) {
          const ox = o.x
          const oy = s.groundY - o.h
          if (px + 18 > ox && px - 14 < ox + o.w && py + 48 > oy && py < s.groundY) {
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
      sky.addColorStop(0, '#120808')
      sky.addColorStop(0.55, '#080808')
      sky.addColorStop(1, '#050505')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(225,6,0,0.12)'
      for (let i = 0; i < 12; i++) {
        const x = ((s.t * 90 + i * 90) % (width + 90)) - 45
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x + 40, height * 0.55)
        ctx.stroke()
      }

      ctx.fillStyle = '#101010'
      ctx.fillRect(0, s.groundY, width, height - s.groundY)
      ctx.fillStyle = '#E10600'
      ctx.fillRect(0, s.groundY, width, 3)
      ctx.fillStyle = 'rgba(46,229,157,0.35)'
      ctx.fillRect(0, s.groundY + 3, width, 1)

      for (const o of s.obstacles) {
        if (o.kind === 'spike') {
          ctx.fillStyle = '#E10600'
          ctx.beginPath()
          ctx.moveTo(o.x, s.groundY)
          ctx.lineTo(o.x + o.w / 2, s.groundY - o.h)
          ctx.lineTo(o.x + o.w, s.groundY)
          ctx.closePath()
          ctx.fill()
        } else if (o.kind === 'block') {
          ctx.fillStyle = '#2a1010'
          ctx.fillRect(o.x, s.groundY - o.h, o.w, o.h)
          ctx.strokeStyle = '#E10600'
          ctx.strokeRect(o.x, s.groundY - o.h, o.w, o.h)
        } else {
          ctx.fillStyle = 'rgba(225,6,0,0.35)'
          ctx.beginPath()
          ctx.ellipse(o.x + o.w / 2, s.groundY - o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#FF2A1F'
          ctx.stroke()
        }
      }

      const pose = !s.alive ? 'hit' : s.jumping ? 'jump' : 'run'
      drawWillCharacter(ctx, {
        x: s.x,
        y: s.groundY + s.y - 10,
        facing: 1,
        pose,
        t: s.t,
        scale: 1.05,
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
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return (
    <GameShell
      title="Runner"
      subtitle="Toque ou Espaço para pular"
      hud={`+${score}`}
      footer={
        ended ? (
          <p className="text-center font-mono text-xs text-mist">
            {alive ? 'Onda atravessada.' : 'Impulso te alcançou.'} XP registrado.
          </p>
        ) : (
          <p className="text-center text-xs text-ash">
            Desvie do obstáculo = desvie da recaída. Mantenha o personagem em movimento por 60s.
          </p>
        )
      }
    >
      <canvas ref={canvasRef} className="h-full min-h-[55vh] w-full touch-none" />
    </GameShell>
  )
}

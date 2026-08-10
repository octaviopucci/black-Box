import { useEffect, useRef, useState } from 'react'
import { rand, setupHiDPICanvas } from '@/lib/canvas'
import { GameShell } from '../GameShell'

type Target = { id: number; x: number; y: number; r: number; life: number }

type Props = { onFinish: (score: number, xp: number) => void }

export function ReflexGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(20)
  const done = useRef(false)
  const data = useRef({
    targets: [] as Target[],
    score: 0,
    t: 20,
    spawn: 0,
    nextId: 1,
    pulse: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    done.current = false
    data.current = { targets: [], score: 0, t: 20, spawn: 0, nextId: 1, pulse: 0 }
    let raf = 0
    let running = true
    let last = performance.now()

    const hit = (cx: number, cy: number) => {
      const s = data.current
      for (let i = s.targets.length - 1; i >= 0; i--) {
        const tg = s.targets[i]
        const dx = cx - tg.x
        const dy = cy - tg.y
        if (dx * dx + dy * dy <= tg.r * tg.r) {
          s.targets.splice(i, 1)
          s.score += 10
          s.pulse = 0.2
          setScore(s.score)
          return
        }
      }
      s.score = Math.max(0, s.score - 3)
      setScore(s.score)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      hit(e.clientX - rect.left, e.clientY - rect.top)
    }
    canvas.addEventListener('pointerdown', onPointer)

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      const s = data.current
      s.pulse = Math.max(0, s.pulse - dt)

      if (!done.current) {
        s.t -= dt
        setLeft(Math.max(0, Math.ceil(s.t)))
        s.spawn -= dt
        if (s.spawn <= 0 && s.targets.length < 4) {
          s.targets.push({
            id: s.nextId++,
            x: rand(40, width - 40),
            y: rand(50, height - 40),
            r: rand(22, 34),
            life: rand(1.1, 1.8),
          })
          s.spawn = rand(0.25, 0.55)
        }
        for (const tg of s.targets) tg.life -= dt
        s.targets = s.targets.filter((tg) => tg.life > 0)

        if (s.t <= 0) {
          done.current = true
          const xp = Math.max(10, Math.round(s.score / 2))
          onFinishRef.current(s.score, xp)
        }
      }

      ctx.clearRect(0, 0, width, height)
      const g = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.7)
      g.addColorStop(0, '#1a0808')
      g.addColorStop(1, '#050505')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      for (const tg of s.targets) {
        const alpha = Math.min(1, tg.life)
        ctx.beginPath()
        ctx.arc(tg.x, tg.y, tg.r + Math.sin(now / 80 + tg.id) * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(225,6,0,${0.25 * alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(tg.x, tg.y, tg.r * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,42,31,${0.85 * alpha})`
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = '700 11px "Chakra Petch", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('TOQUE', tg.x, tg.y + 4)
      }

      if (s.pulse > 0) {
        ctx.fillStyle = `rgba(46,229,157,${s.pulse})`
        ctx.fillRect(0, 0, width, height)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return (
    <GameShell
      title="Reflexo"
      subtitle="Acerte os alvos antes que sumam"
      hud={`${left}s · ${score}`}
      footer={
        <p className="text-center text-xs text-ash">
          Dispara dopamina saudável no pico. Errou? O impulso ganha um ponto. Foque.
        </p>
      }
    >
      <canvas ref={canvasRef} className="h-full min-h-[55vh] w-full touch-none" />
    </GameShell>
  )
}

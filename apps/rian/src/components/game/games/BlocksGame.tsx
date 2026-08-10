import { useEffect, useRef, useState } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { GameShell } from '../GameShell'

type Props = { onFinish: (score: number, xp: number) => void }

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
]

function rotate(m: number[][]) {
  const h = m.length
  const w = m[0].length
  const out = Array.from({ length: w }, () => Array(h).fill(0))
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[x][h - 1 - y] = m[y][x]
  return out
}

export function BlocksGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const [score, setScore] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    done.current = false
    const cols = 10
    const rows = 18
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0))
    let piece = {
      shape: SHAPES[0].map((r) => [...r]),
      x: 3,
      y: 0,
    }
    let scoreLocal = 0
    let dropAcc = 0
    let time = 60
    let raf = 0
    let running = true
    let last = performance.now()

    const spawn = () => {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].map((r) => [...r])
      piece = { shape, x: 3, y: 0 }
      if (!valid(piece.x, piece.y, piece.shape)) finish('topo')
    }

    const valid = (x: number, y: number, shape: number[][]) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue
          const nx = x + c
          const ny = y + r
          if (nx < 0 || nx >= cols || ny >= rows) return false
          if (ny >= 0 && grid[ny][nx]) return false
        }
      }
      return true
    }

    const merge = () => {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue
          const ny = piece.y + r
          const nx = piece.x + c
          if (ny >= 0) grid[ny][nx] = 1
        }
      }
      let cleared = 0
      for (let y = rows - 1; y >= 0; y--) {
        if (grid[y].every(Boolean)) {
          grid.splice(y, 1)
          grid.unshift(Array(cols).fill(0))
          cleared++
          y++
        }
      }
      if (cleared) {
        scoreLocal += cleared * 40
        setScore(scoreLocal)
      }
      spawn()
    }

    const finish = (why: string) => {
      if (done.current) return
      done.current = true
      void why
      onFinishRef.current(scoreLocal, Math.max(12, Math.round(scoreLocal / 3) + 10))
    }

    const move = (dx: number, dy: number) => {
      if (done.current) return
      if (valid(piece.x + dx, piece.y + dy, piece.shape)) {
        piece.x += dx
        piece.y += dy
        return true
      }
      return false
    }

    const hardDrop = () => {
      while (move(0, 1)) {
        /* drop */
      }
      merge()
      scoreLocal += 2
      setScore(scoreLocal)
    }

    const onKey = (e: KeyboardEvent) => {
      if (done.current) return
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0)
      if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0)
      if (e.key === 'ArrowDown' || e.key === 's') {
        if (!move(0, 1)) merge()
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        e.preventDefault()
        const next = rotate(piece.shape)
        if (valid(piece.x, piece.y, next)) piece.shape = next
      }
      if (e.key === 'Enter') hardDrop()
    }

    let sx = 0
    let sy = 0
    const onTouchStart = (e: TouchEvent) => {
      sx = e.changedTouches[0].clientX
      sy = e.changedTouches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
        const next = rotate(piece.shape)
        if (valid(piece.x, piece.y, next)) piece.shape = next
        return
      }
      if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
        if (!move(0, 1)) merge()
        return
      }
      move(dx > 0 ? 1 : -1, 0)
    }
    const onClick = () => {
      if (!move(0, 1)) merge()
    }

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('click', onClick)
    spawn()

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!done.current) {
        time -= dt
        dropAcc += dt
        if (dropAcc > 0.55) {
          dropAcc = 0
          if (!move(0, 1)) merge()
        }
        if (time <= 0) finish('tempo')
      }

      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      const cell = Math.min((width - 24) / cols, (height - 24) / rows)
      const ox = (width - cell * cols) / 2
      const oy = (height - cell * rows) / 2
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.strokeRect(ox, oy, cell * cols, cell * rows)

      const paint = (x: number, y: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(ox + x * cell + 1, oy + y * cell + 1, cell - 2, cell - 2)
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[y][x]) paint(x, y, '#5a1212')
        }
      }
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) paint(piece.x + c, piece.y + r, '#E10600')
        }
      }
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
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <GameShell
      title="Blocos"
      subtitle="Setas · toque gira · clique desce"
      hud={`${score}`}
      footer={
        <p className="text-center text-xs text-ash">
          Foco visual. A mente sai do gatilho enquanto a onda passa.
        </p>
      }
    >
      <canvas ref={canvasRef} className="h-full min-h-[55vh] w-full touch-none" />
    </GameShell>
  )
}

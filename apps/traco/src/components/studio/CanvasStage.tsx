import { useEffect, useRef } from 'react'
import { useStudio } from '@/store/StudioContext'
import type { Point } from '@/types'

export function CanvasStage() {
  const studio = useStudio()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    studio.attachView(canvasRef.current)
    return () => studio.attachView(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studio.docId])

  const toCanvasPoint = (clientX: number, clientY: number, pressure?: number): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * studio.width
    const y = ((clientY - rect.top) / rect.height) * studio.height
    return { x, y, pressure: pressure && pressure > 0 ? pressure : 0.7 }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const p = toCanvasPoint(e.clientX, e.clientY, e.pressure)
    if (!p) return
    studio.pointerDown(p, e.buttons, e.shiftKey)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const p = toCanvasPoint(e.clientX, e.clientY, e.pressure)
    if (!p) return
    studio.pointerMove(p)
  }

  const onPointerUp = () => studio.pointerUp()

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) return
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const next = Math.min(4, Math.max(0.2, studio.zoom * (e.deltaY > 0 ? 0.92 : 1.08)))
        studio.setZoom(next)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [studio])

  const cursor = studio.tool === 'hand' ? 'grab' : 'crosshair'

  return (
    <div
      ref={wrapRef}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#1a2433,transparent_45%),linear-gradient(180deg,#0c1016,#121821)]"
    >
      <div
        className="checkerboard shadow-soft"
        style={{
          transform: `translate(${studio.panX}px, ${studio.panY}px) scale(${studio.zoom})`,
          transformOrigin: 'center center',
          width: studio.width,
          height: studio.height,
        }}
      >
        <canvas
          ref={canvasRef}
          width={studio.width}
          height={studio.height}
          className="touch-none"
          style={{ width: studio.width, height: studio.height, cursor }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line/80 bg-panel/80 px-3 py-1 text-xs text-mist backdrop-blur">
        {Math.round(studio.zoom * 100)}% · {studio.width}×{studio.height}
        {studio.selection.active ? ' · seleção ativa' : ''}
      </div>
    </div>
  )
}

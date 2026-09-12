import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import * as THREE from 'three'
import { AuraEngine } from './three/engine'
import { ACTS, type ActId } from './film/constants'
import { jumpToAct } from './film/director'
import type { FilmState } from './film/director'

const SCROLL_HEIGHT = 12000

function Overlay({
  state,
  material,
  onMaterialChange,
}: {
  state: FilmState
  material: 'titanium' | 'ceramic' | 'transparent'
  onMaterialChange: (m: 'titanium' | 'ceramic' | 'transparent') => void
}) {
  const light = state.lightModeBlend > 0.5
  const ink = light ? 'var(--ink-dark)' : 'var(--ink-light)'
  const hairline = light ? 'var(--hairline-dark)' : 'var(--hairline)'

  return (
    <div
      className={`overlay ${state.interactive ? 'overlay--interactive' : ''}`}
      style={{ color: ink }}
    >
      {state.title && (
        <p
          className="mono"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.35,
            letterSpacing: '0.35em',
          }}
        >
          {state.title}
        </p>
      )}

      {state.displayTitle && (
        <h1
          className="display-title"
          style={{
            position: 'absolute',
            top: state.actId === 'final' ? '18%' : '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: state.actId === 'final' ? 'clamp(3rem, 11vw, 9rem)' : 'clamp(2.5rem, 14vw, 11rem)',
            opacity: state.actId === 'darkness' ? 0.08 : state.actId === 'reveal' ? 0.12 : 0.18,
            whiteSpace: 'nowrap',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          {state.displayTitle}
        </h1>
      )}

      {state.subtitle && (
        <p
          className="display-title"
          style={{
            position: 'absolute',
            bottom: state.actId === 'final' ? '28%' : '22%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: state.actId === 'final' ? 'clamp(0.75rem, 2vw, 1.1rem)' : 'clamp(1rem, 3vw, 2rem)',
            opacity: state.actId === 'final' ? 0.85 : 0.7,
            letterSpacing: state.actId === 'final' ? '0.06em' : '-0.02em',
            fontWeight: state.actId === 'final' ? 300 : 200,
          }}
        >
          {state.subtitle}
        </p>
      )}

      {state.macroLabel && (
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span className="mono" style={{ opacity: 0.6 }}>
            {String(state.macroIndex + 1).padStart(2, '0')} / 08
          </span>
          <span style={{ width: 40, height: 1, background: hairline }} />
          <span className="mono" style={{ opacity: 0.85 }}>
            {state.macroLabel}
          </span>
        </div>
      )}

      {state.specs && (
        <p
          className="mono"
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.45,
            fontSize: 9,
          }}
        >
          {state.specs}
        </p>
      )}

      {state.interactive && (
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div className="material-selector" style={{ borderColor: hairline }}>
            {(['titanium', 'ceramic', 'transparent'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={material === m ? 'active' : ''}
                onClick={() => onMaterialChange(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" className="explore-btn">
            EXPLORE
          </button>
        </div>
      )}

      <div
        className="mono"
        style={{
          position: 'absolute',
          top: 20,
          left: 24,
          opacity: 0.3,
          fontSize: 9,
        }}
      >
        {state.actLabel}
      </div>

      <div
        className="mono"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 48,
          opacity: 0.25,
          fontSize: 9,
          textAlign: 'right',
        }}
      >
        <div>X {((state.progress * 100) % 1 * 360).toFixed(1)}°</div>
        <div>Y {(state.progress * 47.3).toFixed(2)}</div>
        <div>Z {state.progress.toFixed(4)}</div>
      </div>

      {state.showCrosshair && (
        <div
          className="crosshair"
          style={{
            left: '50%',
            top: '50%',
            color: ink,
          }}
        />
      )}
    </div>
  )
}

function ProgressRail({ progress, light }: { progress: number; light: boolean }) {
  return (
    <div className="progress-rail" style={{ color: light ? 'var(--ink-dark)' : 'var(--ink-light)' }}>
      <div className="progress-rail__fill" style={{ height: `${progress * 100}%` }} />
    </div>
  )
}

function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top = `${e.clientY}px`
      }
      const target = e.target as HTMLElement
      setHover(!!target.closest('button, a, .material-selector'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={ref} className={`cursor ${hover ? 'cursor--hover' : ''}`}>
      <div className="cursor-dot" />
    </div>
  )
}

function DebugPanel({
  progress,
  onJump,
}: {
  progress: number
  onJump: (actId: ActId) => void
}) {
  const debugDefault =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('debug')
  const [open, setOpen] = useState(debugDefault)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') setOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null
  return (
    <div className="debug-panel">
      <div>Progress: {(progress * 100).toFixed(1)}%</div>
      <div style={{ marginTop: 6 }}>
        {ACTS.map((a) => (
          <button key={a.id} type="button" onClick={() => onJump(a.id)}>
            {a.label}
          </button>
        ))}
      </div>
      <button type="button" style={{ marginTop: 6 }} onClick={() => setOpen(false)}>
        hide
      </button>
    </div>
  )
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<AuraEngine | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)
  const dragStart = useRef({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [state, setState] = useState<FilmState | null>(null)
  const [material, setMaterial] = useState<'titanium' | 'ceramic' | 'transparent'>('titanium')

  const initEngine = useCallback(() => {
    if (!canvasRef.current || engineRef.current) return
    const engine = new AuraEngine(canvasRef.current)
    engine.onStateChange = setState
    engine.setProgress(0)
    engineRef.current = engine
    setLoaded(true)
    setState(engine.director.getState())
  }, [])

  useEffect(() => {
    initEngine()
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    const onScroll = () => {
      const p = lenis.scroll / SCROLL_HEIGHT
      engineRef.current?.setProgress(Math.max(0, Math.min(1, p)))
    }
    lenis.on('scroll', onScroll)

    const raf = (time: number) => {
      lenis.raf(time)
      engineRef.current?.tick()
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    const onResize = () => {
      const el = canvasRef.current?.parentElement
      if (el && engineRef.current) {
        engineRef.current.resize(el.clientWidth, el.clientHeight)
      }
    }
    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [initEngine])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let dragging = false
    let lastX = 0
    let lastY = 0
    let accX = 0
    let accY = 0

    const onDown = (e: PointerEvent) => {
      if (!state?.interactive) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    const onMove = (e: PointerEvent) => {
      engineRef.current?.handlePointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        dragging,
        new THREE.Vector2(accX, accY),
      )
      if (dragging && state?.interactive) {
        accX += (e.clientX - lastX) * 0.003
        accY += (e.clientY - lastY) * 0.003
        accX *= 0.98
        lastX = e.clientX
        lastY = e.clientY
      } else if (state?.interactive) {
        accX = (e.clientX / window.innerWidth - 0.5) * 0.15
        accY = (e.clientY / window.innerHeight - 0.5) * 0.08
      }
    }
    const onUp = () => {
      dragging = false
    }

    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [state?.interactive])

  const handleJump = (actId: ActId) => {
    const p = jumpToAct(actId)
    lenisRef.current?.scrollTo(p * SCROLL_HEIGHT, { immediate: false })
    engineRef.current?.setProgress(p)
  }

  const handleMaterial = (m: 'titanium' | 'ceramic' | 'transparent') => {
    setMaterial(m)
    engineRef.current?.setMaterial(m)
  }

  return (
    <>
      <div className="scroll-spacer" style={{ height: SCROLL_HEIGHT }} aria-hidden />
      <div className={`loader ${loaded ? 'hidden' : ''}`}>
        <span className="mono">INITIALIZING AURA ONE</span>
      </div>
      <div className="viewport">
        <div className="canvas-host">
          <canvas ref={canvasRef} />
        </div>
        <div className={`grain ${state?.lightMode ? 'light-mode' : ''}`} />
        <div className={`vignette ${state?.lightMode ? 'light-mode' : ''}`} />
        {state && (
          <>
            <Overlay state={state} material={material} onMaterialChange={handleMaterial} />
            <ProgressRail progress={state.progress} light={state.lightMode} />
          </>
        )}
        <CustomCursor />
        <DebugPanel progress={state?.progress ?? 0} onJump={handleJump} />
      </div>
    </>
  )
}


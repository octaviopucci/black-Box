import { useCallback, useEffect, useRef, useState } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { drawWillCharacter } from '../WillCharacter'
import { drawBasePillar, drawViceEntity } from '../ViceEntity'
import { GameShell } from '../GameShell'

type Phase = 'intro' | 'vontade' | 'queda' | 'construir' | 'comBase' | 'vitoria' | 'derrota'

type Props = { onFinish: (score: number, xp: number) => void }

const PILLARS = [
  { id: 'rotina', label: 'ROTINA', hint: 'Hábitos do dia' },
  { id: 'proposito', label: 'PROPÓSITO', hint: 'Seu porquê' },
  { id: 'protocolo', label: 'PROTOCOLO', hint: 'Passo a passo' },
] as const

/**
 * Mobile-first symbolic fight.
 * Willpower alone loses. With BASE structure, the wave becomes survivable.
 * Primary input: touch / hold. Keyboard still works on desktop.
 */
export function LutaGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const [phase, setPhase] = useState<Phase>('intro')
  const [willPct, setWillPct] = useState(42)
  const [vicePct, setVicePct] = useState(58)
  const [built, setBuilt] = useState<string[]>([])
  const [caption, setCaption] = useState('Segure o botão para resistir. Só vontade, sem estrutura.')
  const [hud, setHud] = useState('ATO 1')
  const [holding, setHolding] = useState(false)

  const phaseRef = useRef<Phase>('intro')
  const builtRef = useRef<string[]>([])
  const holdingRef = useRef(false)
  const finished = useRef(false)
  const stateRef = useRef({
    t: 0,
    will: 0.42,
    vice: 0.58,
    pressure: 0,
    tapBoost: 0,
    basePower: 0,
    phaseTimer: 0,
    shake: 0,
    score: 0,
    ended: false,
    narrow: false,
  })

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    builtRef.current = built
  }, [built])

  const setPh = useCallback((p: Phase, msg: string, hudLabel: string) => {
    phaseRef.current = p
    setPhase(p)
    setCaption(msg)
    setHud(hudLabel)
    stateRef.current.phaseTimer = 0
  }, [])

  const finish = useCallback((won: boolean) => {
    const s = stateRef.current
    if (finished.current || s.ended) return
    finished.current = true
    s.ended = true
    const score = Math.round(s.score + (won ? 100 : 20) + builtRef.current.length * 30)
    const xp = won ? 45 + builtRef.current.length * 10 : 12
    onFinishRef.current(score, xp)
  }, [])

  const pulseResist = useCallback(() => {
    const p = phaseRef.current
    const s = stateRef.current
    if (p === 'intro') {
      setPh(
        'vontade',
        'Segure para forçar a vontade. O vício é mais forte. Isso é o ponto.',
        'ATO 1 · SÓ VONTADE',
      )
      return
    }
    if (p === 'vontade' || p === 'comBase') {
      s.tapBoost = Math.min(1, s.tapBoost + (p === 'comBase' ? 0.28 : 0.18))
      s.score += p === 'comBase' ? 2.4 : 1.2
    }
    if (p === 'queda') {
      holdingRef.current = false
      setHolding(false)
      setPh(
        'construir',
        'Vontade caiu. Toque nos 3 pilares e levante a BASE.',
        'ATO 2 · CONSTRUIR BASE',
      )
    }
  }, [setPh])

  const startHold = useCallback(() => {
    const p = phaseRef.current
    if (p === 'construir' || p === 'vitoria' || p === 'derrota') return
    if (p === 'queda') {
      pulseResist()
      return
    }
    holdingRef.current = true
    setHolding(true)
    pulseResist()
  }, [pulseResist])

  const endHold = useCallback(() => {
    holdingRef.current = false
    setHolding(false)
  }, [])

  const buildPillar = useCallback(
    (id: string) => {
      if (phaseRef.current !== 'construir') return
      if (builtRef.current.includes(id)) return
      const next = [...builtRef.current, id]
      builtRef.current = next
      setBuilt(next)
      stateRef.current.basePower = next.length / 3
      if (next.length >= 3) {
        stateRef.current.will = 0.38
        stateRef.current.vice = 0.55
        stateRef.current.pressure = 0
        setPh(
          'comBase',
          'BASE ativa. Segure de novo. Agora a estrutura segura o que a vontade sozinha não segura.',
          'ATO 3 · COM BASE',
        )
      } else {
        setCaption(`${next.length}/3 pilares. Sem BASE completa, a luta ainda é frágil.`)
      }
    },
    [setPh],
  )

  // Lock page scroll while playing (mobile)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Game loop + draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0
    let running = true
    let last = performance.now()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        if (!holdingRef.current) startHold()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        endHold()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const s = stateRef.current
      s.t += dt
      s.phaseTimer += dt
      s.shake = Math.max(0, s.shake - dt)

      // Continuous hold resistance (mobile-friendly)
      if (holdingRef.current && (phaseRef.current === 'vontade' || phaseRef.current === 'comBase')) {
        s.tapBoost = Math.min(1, s.tapBoost + dt * 1.8)
        s.score += dt * (phaseRef.current === 'comBase' ? 8 : 4)
      } else {
        s.tapBoost = Math.max(0, s.tapBoost - dt * 0.9)
      }

      const p = phaseRef.current
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) {
        raf = requestAnimationFrame(loop)
        return
      }
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)
      s.narrow = width < 480

      if (p === 'vontade' && !s.ended) {
        const push = 0.12 + s.pressure * 0.045
        s.vice = Math.min(0.92, s.vice + push * dt)
        s.will = Math.max(0.08, s.will - push * 0.72 * dt + s.tapBoost * 0.42 * dt)
        s.pressure += dt * 0.08
        s.score += dt * 3
        if (s.will < 0.12 || s.phaseTimer > 12) {
          s.shake = 0.45
          holdingRef.current = false
          setHolding(false)
          setPh(
            'queda',
            'A vontade perdeu. Não por fraqueza. Por falta de BASE.',
            'QUEDA',
          )
        }
      }

      if (p === 'comBase' && !s.ended) {
        const structure = 0.45 + s.basePower * 0.55
        const push = 0.1 + s.pressure * 0.035
        s.vice = Math.min(0.88, s.vice + push * (1 - structure * 0.72) * dt)
        s.will = Math.min(
          0.95,
          Math.max(
            0.15,
            s.will -
              push * 0.22 * (1 - structure) * dt +
              s.tapBoost * 0.6 * dt +
              structure * 0.09 * dt,
          ),
        )
        s.pressure += dt * 0.055
        s.score += dt * 6 * structure
        if (s.will > 0.7 && s.phaseTimer > 8) {
          setPh(
            'vitoria',
            'Com BASE, a onda passa. Estrutura sustenta o que força de vontade não sustenta.',
            'VITÓRIA',
          )
          finish(true)
        } else if (s.will < 0.12) {
          setPh('derrota', 'A BASE ainda era frágil. Reconstrua e enfrente de novo.', 'RECAÍDA')
          finish(false)
        } else if (s.phaseTimer > 18 && s.will >= 0.4) {
          setPh('vitoria', 'Você atravessou. Não sozinho: com estrutura.', 'VITÓRIA')
          finish(true)
        }
      }

      if (p === 'queda' && s.phaseTimer > 1.6) {
        setCaption('Toque em CONSTRUIR BASE abaixo. Três pilares.')
      }

      setWillPct(Math.round(s.will * 100))
      setVicePct(Math.round(s.vice * 100))

      // DRAW (portrait-aware layout)
      const shakeX = (Math.random() - 0.5) * s.shake * 8
      ctx.save()
      ctx.translate(shakeX, 0)
      ctx.clearRect(-10, 0, width + 20, height)

      const sky = ctx.createLinearGradient(0, 0, width, height)
      sky.addColorStop(0, '#0a0606')
      sky.addColorStop(0.5, '#050505')
      sky.addColorStop(1, p === 'comBase' || p === 'vitoria' ? '#06140f' : '#120606')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, width, height)

      const midY = height * (s.narrow ? 0.62 : 0.68)

      // tug bar (thicker on mobile)
      const barY = height * 0.08
      const barH = s.narrow ? 18 : 14
      const barW = width * 0.86
      const barX = width * 0.07
      ctx.fillStyle = '#151515'
      ctx.fillRect(barX, barY, barW, barH)
      const total = s.will + s.vice
      const willShare = total > 0 ? s.will / total : 0.5
      ctx.fillStyle = '#2EE59D'
      ctx.fillRect(barX, barY, barW * willShare, barH)
      ctx.fillStyle = '#E10600'
      ctx.fillRect(barX + barW * willShare, barY, barW * (1 - willShare), barH)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.strokeRect(barX, barY, barW, barH)
      ctx.fillStyle = '#C9C9C9'
      ctx.font = `600 ${s.narrow ? 10 : 11}px "IBM Plex Mono", monospace`
      ctx.fillText('VONTADE', barX, barY - 6)
      ctx.textAlign = 'right'
      ctx.fillText('VÍCIO', barX + barW, barY - 6)
      ctx.textAlign = 'left'

      // ground
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.beginPath()
      ctx.moveTo(width * 0.06, midY)
      ctx.lineTo(width * 0.94, midY)
      ctx.stroke()

      // pillars in canvas (visual only; HTML buttons handle taps on mobile)
      if (p === 'construir' || p === 'comBase' || p === 'vitoria' || p === 'queda') {
        const slots = s.narrow ? [0.22, 0.5, 0.78] : [0.28, 0.5, 0.72]
        PILLARS.forEach((pillar, i) => {
          const active = builtRef.current.includes(pillar.id)
          drawBasePillar(ctx, width * slots[i], midY, pillar.label, active, s.t)
        })
      }

      const willX = width * (s.narrow ? 0.26 : 0.22)
      const viceX = width * (s.narrow ? 0.76 : 0.78)
      const charScale = Math.min(width, height) / (s.narrow ? 260 : 320)

      let pose: 'resist' | 'hit' | 'win' | 'idle' = 'resist'
      if (p === 'queda' || p === 'derrota') pose = 'hit'
      if (p === 'vitoria') pose = 'win'
      if (p === 'intro' || p === 'construir') pose = 'idle'
      if (holdingRef.current && (p === 'vontade' || p === 'comBase')) pose = 'resist'

      const willScale = charScale * (p === 'comBase' || p === 'vitoria' ? 1.15 : 1)
      drawWillCharacter(ctx, {
        x: willX,
        y: midY - 56 * willScale,
        facing: 1,
        pose,
        t: s.t,
        scale: willScale,
      })

      if (p === 'comBase' || p === 'vitoria') {
        ctx.strokeStyle = `rgba(46,229,157,${0.35 + Math.sin(s.t * 5) * 0.15})`
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(
          willX,
          midY - 40 * willScale,
          78 * willScale * Math.max(0.55, s.basePower),
          0,
          Math.PI * 2,
        )
        ctx.stroke()
      }

      drawViceEntity(ctx, viceX, midY - 24, s.t, s.vice, charScale * (1 + s.vice * 0.35))

      if (p === 'intro') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        const boxY = height * 0.3
        const boxH = s.narrow ? 88 : 78
        ctx.fillRect(0, boxY, width, boxH)
        ctx.fillStyle = '#F3F3F3'
        ctx.font = `700 ${s.narrow ? 18 : 22}px "Chakra Petch", sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('A LUTA CONTRA O VÍCIO', width / 2, boxY + (s.narrow ? 32 : 30))
        ctx.font = `500 ${s.narrow ? 12 : 13}px "Sora", sans-serif`
        ctx.fillStyle = '#C9C9C9'
        ctx.fillText('Toque e segure RESISTIR para começar', width / 2, boxY + (s.narrow ? 58 : 54))
        ctx.textAlign = 'left'
      }

      if (p === 'queda') {
        ctx.fillStyle = 'rgba(225,6,0,0.12)'
        ctx.fillRect(0, 0, width, height)
      }
      if (p === 'vitoria') {
        ctx.fillStyle = 'rgba(46,229,157,0.08)'
        ctx.fillRect(0, 0, width, height)
      }

      // hold pulse ring under will character
      if (holdingRef.current && (p === 'vontade' || p === 'comBase')) {
        ctx.strokeStyle = 'rgba(46,229,157,0.45)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(willX, midY + 6, 22 + Math.sin(s.t * 12) * 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [endHold, finish, setPh, startHold])

  const showResist =
    phase === 'intro' || phase === 'vontade' || phase === 'comBase' || phase === 'queda'
  const showBuild = phase === 'construir'

  return (
    <GameShell
      title="A Luta"
      subtitle="Vontade sozinha perde. Com BASE, fica possível."
      hud={
        <span className="block">
          {hud}
          <br />
          <span className="text-will">{willPct}%</span>
          <span className="text-ash">/</span>
          <span className="text-signal">{vicePct}%</span>
        </span>
      }
      footer={
        <div className="mx-auto w-full max-w-lg space-y-3">
          <p className="text-center text-xs leading-snug text-ash sm:text-sm">{caption}</p>

          {showBuild ? (
            <div className="grid grid-cols-3 gap-2">
              {PILLARS.map((pillar) => {
                const on = built.includes(pillar.id)
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    disabled={on}
                    onClick={() => buildPillar(pillar.id)}
                    className={`min-h-[4.5rem] rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98] ${
                      on
                        ? 'border-will/50 bg-will/15 text-will'
                        : 'border-line bg-steel text-paper active:border-will/40'
                    }`}
                  >
                    <span className="block font-display text-[11px] font-bold tracking-wide">
                      {pillar.label}
                    </span>
                    <span className="mt-1 block text-[10px] text-ash">{on ? 'ATIVO' : pillar.hint}</span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {showResist ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault()
                startHold()
              }}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onPointerCancel={endHold}
              className={`flex min-h-14 w-full select-none items-center justify-center rounded-2xl font-display text-base font-bold uppercase tracking-[0.16em] text-white transition active:scale-[0.99] ${
                holding
                  ? 'bg-will text-ink shadow-[0_0_28px_rgba(46,229,157,0.35)]'
                  : phase === 'queda'
                    ? 'bg-will/90 text-ink'
                    : 'bg-signal hover:bg-signalHot'
              }`}
              style={{ touchAction: 'none' }}
            >
              {phase === 'intro'
                ? 'Segurar para começar'
                : phase === 'queda'
                  ? 'Construir BASE'
                  : holding
                    ? 'Resistindo…'
                    : 'Segurar · Resistir'}
            </button>
          ) : null}

          {phase === 'vontade' || phase === 'comBase' ? (
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
              Celular: segure o botão · PC: espaço
            </p>
          ) : null}
        </div>
      }
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
      />
    </GameShell>
  )
}

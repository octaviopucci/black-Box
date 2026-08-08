import { useEffect, useRef, useState } from 'react'
import { setupHiDPICanvas } from '@/lib/canvas'
import { drawWillCharacter } from '../WillCharacter'
import { drawBasePillar, drawViceEntity } from '../ViceEntity'
import { GameShell } from '../GameShell'

type Phase = 'intro' | 'vontade' | 'queda' | 'construir' | 'comBase' | 'vitoria' | 'derrota'

type Props = { onFinish: (score: number, xp: number) => void }

const PILLARS = [
  { id: 'rotina', label: 'ROTINA' },
  { id: 'proposito', label: 'PROPÓSITO' },
  { id: 'protocolo', label: 'PROTOCOLO' },
] as const

/**
 * Symbolic fight: willpower alone loses to addiction.
 * With BASE structure, the same wave becomes survivable.
 */
export function LutaGame({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const [phase, setPhase] = useState<Phase>('intro')
  const [willPct, setWillPct] = useState(42)
  const [vicePct, setVicePct] = useState(58)
  const [built, setBuilt] = useState<string[]>([])
  const [caption, setCaption] = useState('Toque para resistir. Só vontade, sem estrutura.')
  const [hud, setHud] = useState('ATO 1')

  const phaseRef = useRef<Phase>('intro')
  const builtRef = useRef<string[]>([])
  const finished = useRef(false)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    builtRef.current = built
  }, [built])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const s = {
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
    }

    let raf = 0
    let running = true
    let last = performance.now()

    const setPh = (p: Phase, msg: string, hudLabel: string) => {
      phaseRef.current = p
      setPhase(p)
      setCaption(msg)
      setHud(hudLabel)
      s.phaseTimer = 0
    }

    const finish = (won: boolean) => {
      if (finished.current || s.ended) return
      finished.current = true
      s.ended = true
      const score = Math.round(s.score + (won ? 100 : 20) + builtRef.current.length * 30)
      const xp = won ? 45 + builtRef.current.length * 10 : 12
      onFinishRef.current(score, xp)
    }

    const resist = () => {
      const p = phaseRef.current
      if (p === 'intro') {
        setPh(
          'vontade',
          'Force a vontade. O vício é mais forte. Isso é o ponto.',
          'ATO 1 · SÓ VONTADE',
        )
        return
      }
      if (p === 'vontade' || p === 'comBase') {
        s.tapBoost = Math.min(1, s.tapBoost + (p === 'comBase' ? 0.22 : 0.14))
        s.score += p === 'comBase' ? 2.2 : 1
      }
      if (p === 'queda') {
        setPh(
          'construir',
          'Vontade caiu. Agora levante a BASE: toque nos 3 pilares.',
          'ATO 2 · CONSTRUIR BASE',
        )
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        resist()
      }
    }
    const onPointer = (e: PointerEvent) => {
      const p = phaseRef.current
      if (p === 'construir') {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const width = rect.width
        // three pillar hit zones
        const slots = [0.28, 0.5, 0.72]
        PILLARS.forEach((pillar, i) => {
          const px = width * slots[i]
          if (Math.abs(x - px) < width * 0.12 && !builtRef.current.includes(pillar.id)) {
            const next = [...builtRef.current, pillar.id]
            builtRef.current = next
            setBuilt(next)
            s.basePower = next.length / 3
            if (next.length >= 3) {
              s.will = 0.35
              s.vice = 0.55
              s.pressure = 0
              setPh(
                'comBase',
                'BASE ativa. A mesma onda volta. Agora a estrutura segura o que a vontade sozinha não segura.',
                'ATO 3 · COM BASE',
              )
            } else {
              setCaption(`${next.length}/3 pilares. Sem BASE completa, a luta ainda é frágil.`)
            }
          }
        })
        return
      }
      resist()
    }

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('pointerdown', onPointer)

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      s.t += dt
      s.phaseTimer += dt
      s.shake = Math.max(0, s.shake - dt)
      s.tapBoost = Math.max(0, s.tapBoost - dt * 0.85)

      const p = phaseRef.current
      const rect = canvas.getBoundingClientRect()
      const { ctx, width, height } = setupHiDPICanvas(canvas, rect.width, rect.height)

      if (p === 'vontade' && !s.ended) {
        // Addiction overpowers willpower by design
        const push = 0.11 + s.pressure * 0.04
        s.vice = Math.min(0.92, s.vice + push * dt)
        s.will = Math.max(0.08, s.will - push * 0.7 * dt + s.tapBoost * 0.35 * dt)
        s.pressure += dt * 0.08
        s.score += dt * 3
        if (s.will < 0.12 || s.phaseTimer > 14) {
          s.shake = 0.5
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
        // BASE absorbs most of the addiction pressure
        s.vice = Math.min(0.88, s.vice + push * (1 - structure * 0.72) * dt)
        s.will = Math.min(
          0.95,
          Math.max(0.15, s.will - push * 0.25 * (1 - structure) * dt + s.tapBoost * 0.55 * dt + structure * 0.08 * dt),
        )
        s.pressure += dt * 0.06
        s.score += dt * 6 * structure
        if (s.will > 0.72 && s.phaseTimer > 10) {
          setPh(
            'vitoria',
            'Com BASE, a onda passa. Estrutura sustenta o que força de vontade não sustenta.',
            'VITÓRIA',
          )
          finish(true)
        } else if (s.will < 0.12) {
          setPh('derrota', 'A BASE ainda era frágil. Reconstrua e enfrente de novo.', 'RECAÍDA')
          finish(false)
        } else if (s.phaseTimer > 22 && s.will >= 0.4) {
          setPh(
            'vitoria',
            'Você atravessou. Não sozinho: com estrutura.',
            'VITÓRIA',
          )
          finish(true)
        }
      }

      if (p === 'queda' && s.phaseTimer > 2.2) {
        // auto-prompt build after beat
        setCaption('Toque para construir a BASE. Três pilares. Sem eles, a luta se repete.')
      }

      setWillPct(Math.round(s.will * 100))
      setVicePct(Math.round(s.vice * 100))

      // DRAW
      const shakeX = (Math.random() - 0.5) * s.shake * 10
      ctx.save()
      ctx.translate(shakeX, 0)
      ctx.clearRect(-10, 0, width + 20, height)

      const sky = ctx.createLinearGradient(0, 0, width, height)
      sky.addColorStop(0, '#0a0606')
      sky.addColorStop(0.5, '#050505')
      sky.addColorStop(1, p === 'comBase' || p === 'vitoria' ? '#06140f' : '#120606')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, width, height)

      // battlefield line
      const midY = height * 0.72
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.beginPath()
      ctx.moveTo(width * 0.08, midY)
      ctx.lineTo(width * 0.92, midY)
      ctx.stroke()

      // tug bar
      const barY = height * 0.14
      const barW = width * 0.7
      const barX = width * 0.15
      ctx.fillStyle = '#151515'
      ctx.fillRect(barX, barY, barW, 14)
      const willW = barW * s.will
      const viceW = barW * s.vice
      // normalize visual so both show relative pressure in one bar
      const total = s.will + s.vice
      const willShare = total > 0 ? s.will / total : 0.5
      ctx.fillStyle = '#2EE59D'
      ctx.fillRect(barX, barY, barW * willShare, 14)
      ctx.fillStyle = '#E10600'
      ctx.fillRect(barX + barW * willShare, barY, barW * (1 - willShare), 14)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.strokeRect(barX, barY, barW, 14)
      ctx.fillStyle = '#C9C9C9'
      ctx.font = '600 11px "IBM Plex Mono", monospace'
      ctx.fillText('VONTADE', barX, barY - 8)
      ctx.textAlign = 'right'
      ctx.fillText('VÍCIO', barX + barW, barY - 8)
      ctx.textAlign = 'left'
      void willW
      void viceW

      // BASE pillars (build + fight phases)
      if (p === 'construir' || p === 'comBase' || p === 'vitoria' || p === 'queda') {
        const slots = [0.28, 0.5, 0.72]
        PILLARS.forEach((pillar, i) => {
          const active = builtRef.current.includes(pillar.id)
          drawBasePillar(ctx, width * slots[i], midY, pillar.label, active, s.t)
        })
      }

      // characters
      const willX = width * 0.22
      const viceX = width * 0.78
      const charScale = Math.min(width, height) / 320

      let pose: 'resist' | 'hit' | 'win' | 'idle' = 'resist'
      if (p === 'queda' || p === 'derrota') pose = 'hit'
      if (p === 'vitoria') pose = 'win'
      if (p === 'intro' || p === 'construir') pose = 'idle'

      const willScale = charScale * (p === 'comBase' || p === 'vitoria' ? 1.2 : 1.05)
      drawWillCharacter(ctx, {
        x: willX,
        y: midY - 56 * willScale,
        facing: 1,
        pose,
        t: s.t,
        scale: willScale,
      })

      // structure shield when BASE is active
      if (p === 'comBase' || p === 'vitoria') {
        ctx.strokeStyle = `rgba(46,229,157,${0.35 + Math.sin(s.t * 5) * 0.15})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(willX, midY - 40 * willScale, 78 * willScale * Math.max(0.55, s.basePower), 0, Math.PI * 2)
        ctx.stroke()
      }

      drawViceEntity(
        ctx,
        viceX,
        midY - 28,
        s.t,
        s.vice,
        charScale * (1.05 + s.vice * 0.4),
      )

      // phase banners
      if (p === 'intro') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(0, height * 0.38, width, 70)
        ctx.fillStyle = '#F3F3F3'
        ctx.font = '700 22px "Chakra Petch", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('A LUTA CONTRA O VÍCIO', width / 2, height * 0.38 + 30)
        ctx.font = '500 13px "Sora", sans-serif'
        ctx.fillStyle = '#C9C9C9'
        ctx.fillText('Toque para começar o Ato 1: só força de vontade', width / 2, height * 0.38 + 52)
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

      ctx.restore()
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

  const buildHint =
    phase === 'construir'
      ? `Pilares ativos: ${built.length}/3 · Toque em Rotina, Propósito e Protocolo`
      : caption

  return (
    <GameShell
      title="A Luta"
      subtitle="Vontade sozinha perde. Com BASE, fica possível."
      hud={hud}
      footer={
        <div className="space-y-2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
            Vontade {willPct}% · Vício {vicePct}%
            {built.length ? ` · BASE ${built.length}/3` : ''}
          </p>
          <p className="text-sm text-ash">{buildHint}</p>
          {phase === 'intro' || phase === 'vontade' || phase === 'comBase' ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
              Toque / Espaço para resistir
            </p>
          ) : null}
        </div>
      }
    >
      <canvas ref={canvasRef} className="h-full min-h-[55vh] w-full touch-none" />
    </GameShell>
  )
}

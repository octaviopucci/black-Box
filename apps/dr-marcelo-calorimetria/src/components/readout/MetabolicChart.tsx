import { motion } from 'framer-motion'
import { readoutSample } from '../../data/readoutSample'
import { useCountUpProgress } from '../../hooks/useCountUp'
import { useChartStage } from '../../hooks/useReportStage'

const W = 400
const H = 228
const PL = 42
const PR = 52
const PT = 22
const PB = 32
const chartW = W - PL - PR
const chartH = H - PT - PB

function mapX(minute: number, maxMin: number) {
  return PL + (minute / maxMin) * chartW
}

function mapY(value: number, min: number, max: number) {
  return PT + chartH - ((value - min) / (max - min)) * chartH
}

function buildPartialPath(
  values: readonly number[],
  minutes: readonly number[],
  min: number,
  max: number,
  maxMin: number,
  progress: number,
) {
  const totalPts = values.length
  const exactIdx = progress * (totalPts - 1)
  const lastFull = Math.floor(exactIdx)
  const frac = exactIdx - lastFull

  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= lastFull && i < totalPts; i++) {
    pts.push({ x: mapX(minutes[i], maxMin), y: mapY(values[i], min, max) })
  }
  if (lastFull < totalPts - 1 && frac > 0) {
    const v0 = values[lastFull]
    const v1 = values[lastFull + 1]
    const m0 = minutes[lastFull]
    const m1 = minutes[lastFull + 1]
    const v = v0 + (v1 - v0) * frac
    const m = m0 + (m1 - m0) * frac
    pts.push({ x: mapX(m, maxMin), y: mapY(v, min, max) })
  }
  if (pts.length < 2) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export function MetabolicChart() {
  const { ref, active: chartActive } = useChartStage()
  const { chart, stabilizationMin } = readoutSample
  const maxMin = chart.minutes[chart.minutes.length - 1]

  /** Long draw — still animating when user sees the chart */
  const drawProgress = useCountUpProgress(chartActive, 6.2, 0.35)
  const scanX = PL + chartW * drawProgress
  const stabThreshold = stabilizationMin / maxMin
  const showStab = drawProgress >= stabThreshold

  const vePath = buildPartialPath(chart.ve, chart.minutes, chart.scales.ve.min, chart.scales.ve.max, maxMin, drawProgress)
  const vo2Path = buildPartialPath(chart.vo2, chart.minutes, chart.scales.vo2.min, chart.scales.vo2.max, maxMin, drawProgress)
  const tmbPath = buildPartialPath(chart.tmb, chart.minutes, chart.scales.tmb.min, chart.scales.tmb.max, maxMin, drawProgress)

  const stabX = mapX(stabilizationMin, maxMin)

  return (
    <div ref={ref} className="mt-8">
      {/* Legend — fades in before draw */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={chartActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-mute"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded bg-[#3DAA5C]" aria-hidden /> Ve (L/min)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded bg-[#7B6BA8]" aria-hidden /> TMB*
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded bg-[#C45C6A]" aria-hidden /> VO₂ (ml/Kg·min)
        </span>
      </motion.div>

      <div className="overflow-x-auto rounded border border-line/80 bg-[#FAFBFA] p-2 sm:p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[340px] w-full" role="img" aria-label="Gráfico de estabilização do exame">
          {/* Y-axis labels — Ve */}
          {chart.scales.ve.ticks.map((t) => (
            <text key={`ve-${t}`} x={PL - 6} y={mapY(t, chart.scales.ve.min, chart.scales.ve.max)} textAnchor="end" dominantBaseline="middle" className="fill-[#3DAA5C] text-[7px] font-mono">
              {t}
            </text>
          ))}

          {/* Y-axis — VO2 right inner */}
          {chart.scales.vo2.ticks.map((t) => (
            <text key={`vo2-${t}`} x={W - PR + 8} y={mapY(t, chart.scales.vo2.min, chart.scales.vo2.max)} textAnchor="start" dominantBaseline="middle" className="fill-[#C45C6A] text-[7px] font-mono">
              {t.toFixed(1)}
            </text>
          ))}

          {/* Y-axis — TMB right outer (offset) */}
          {chart.scales.tmb.ticks.map((t, i) => (
            <text key={`tmb-${t}`} x={W - 6} y={PT + (i / (chart.scales.tmb.ticks.length - 1)) * chartH} textAnchor="end" dominantBaseline="middle" className="fill-[#7B6BA8] text-[6px] font-mono">
              {t}
            </text>
          ))}

          {/* Grid */}
          {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((m) => (
            <g key={m}>
              <line x1={mapX(m, maxMin)} y1={PT} x2={mapX(m, maxMin)} y2={PT + chartH} stroke="#E2E6E3" strokeWidth="1" />
              {m % 4 === 0 && (
                <text x={mapX(m, maxMin)} y={H - 8} textAnchor="middle" className="fill-mute text-[8px] font-mono">
                  {m}
                </text>
              )}
            </g>
          ))}

          <line x1={PL} y1={PT + chartH} x2={PL + chartW} y2={PT + chartH} stroke="#D7DEDA" strokeWidth="1" />

          {/* Animated lines — built point-by-point from progress */}
          {tmbPath && (
            <path d={tmbPath} fill="none" stroke="#7B6BA8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {vo2Path && (
            <path d={vo2Path} fill="none" stroke="#C45C6A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {vePath && (
            <path d={vePath} fill="none" stroke="#3DAA5C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Scan cursor — travels WITH the draw, separate from finished state */}
          {chartActive && drawProgress < 1 && (
            <g>
              <line x1={scanX} y1={PT} x2={scanX} y2={PT + chartH} stroke="rgba(198,100,46,0.35)" strokeWidth="1" />
              <circle cx={scanX} cy={PT + chartH} r="3" fill="#C6642E" opacity={0.85} />
            </g>
          )}

          {/* Stabilization — only after scan passes that minute */}
          {showStab && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <line x1={stabX} y1={PT} x2={stabX} y2={PT + chartH} stroke="#C6642E" strokeWidth="1.5" />
              <text x={stabX + 3} y={PT + 11} className="fill-ember text-[7px] font-medium">
                Tempo de Estabilização
              </text>
            </motion.g>
          )}

          <text x={W / 2} y={H - 1} textAnchor="middle" className="fill-mute text-[8px]">
            Tempo (min)
          </text>

          {/* HandyMET mark */}
          <text x={W - 8} y={PT + chartH - 4} textAnchor="end" className="text-[9px] font-bold">
            <tspan fill="#C6642E">HANDY </tspan>
            <tspan fill="#6B7370" className="font-normal">MET</tspan>
          </text>
        </svg>
      </div>

      {!chartActive && (
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-mute/60">
          Role para iniciar o gráfico
        </p>
      )}
    </div>
  )
}

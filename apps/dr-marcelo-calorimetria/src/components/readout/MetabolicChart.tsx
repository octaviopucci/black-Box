import { motion } from 'framer-motion'
import { readoutSample } from '../../data/readoutSample'
import { useCountUpProgress } from '../../hooks/useCountUp'
import { useChartStage } from '../../hooks/useReportStage'

/** viewBox calibrado para caber em mobile sem scroll horizontal */
const VB = { w: 300, h: 252 }
const PL = 28
const PR = 22
const PT = 24
const PB = 38
const plotW = VB.w - PL - PR
const plotH = VB.h - PT - PB

function mapX(minute: number, maxMin: number) {
  return PL + (minute / maxMin) * plotW
}

function mapY(value: number, min: number, max: number) {
  return PT + plotH - ((value - min) / (max - min)) * plotH
}

function tickRange(min: number, max: number, step: number) {
  const ticks: number[] = []
  for (let v = min; v <= max + step * 0.01; v += step) ticks.push(v)
  return ticks
}

function buildSeriesPath(
  values: readonly number[],
  minutes: readonly number[],
  min: number,
  max: number,
  maxMin: number,
  progress: number,
) {
  const exactIdx = progress * (minutes.length - 1)
  const lastFull = Math.floor(exactIdx)
  const frac = exactIdx - lastFull
  const pts: { x: number; y: number }[] = []

  for (let i = 0; i <= lastFull && i < minutes.length; i++) {
    pts.push({ x: mapX(minutes[i], maxMin), y: mapY(values[i], min, max) })
  }
  if (lastFull < minutes.length - 1 && frac > 0) {
    const v = values[lastFull] + (values[lastFull + 1] - values[lastFull]) * frac
    const m = minutes[lastFull] + (minutes[lastFull + 1] - minutes[lastFull]) * frac
    pts.push({ x: mapX(m, maxMin), y: mapY(v, min, max) })
  }
  if (pts.length < 2) return { path: '', pts: [] as { x: number; y: number }[] }
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
  return { path, pts }
}

const LEGEND = [
  { color: '#3DAA5C', label: 'Ve (L/min)' },
  { color: '#7B6BA8', label: 'TMB*' },
  { color: '#B8424F', label: 'VO₂ (mL/Kg·min)' },
] as const

export function MetabolicChart() {
  const { ref, active: chartActive } = useChartStage()
  const { chart, stabilizationMin } = readoutSample
  const maxMin = chart.minutes[chart.minutes.length - 1]
  const drawProgress = useCountUpProgress(chartActive, 6, 0.3)

  const ve = buildSeriesPath(chart.ve, chart.minutes, chart.scales.ve.min, chart.scales.ve.max, maxMin, drawProgress)
  const tmb = buildSeriesPath(chart.tmb, chart.minutes, chart.scales.tmb.min, chart.scales.tmb.max, maxMin, drawProgress)
  const vo2 = buildSeriesPath(chart.vo2, chart.minutes, chart.scales.vo2.min, chart.scales.vo2.max, maxMin, drawProgress)

  const scanX = mapX(maxMin * drawProgress, maxMin)
  const stabX = mapX(stabilizationMin, maxMin)
  const showStab = drawProgress >= stabilizationMin / maxMin

  const veTicks = tickRange(chart.scales.ve.min, chart.scales.ve.max, chart.scales.ve.step)
  const tmbTicks = tickRange(chart.scales.tmb.min, chart.scales.tmb.max, chart.scales.tmb.step)
  const vo2Ticks = tickRange(chart.scales.vo2.min, chart.scales.vo2.max, chart.scales.vo2.step)
  const xTicks = tickRange(0, maxMin, 2)

  return (
    <div ref={ref} className="mt-6 w-full max-w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={chartActive ? { opacity: 1 } : {}}
        className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
      >
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-[9px] text-[#444] sm:text-[10px]">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} aria-hidden />
            {item.label}
          </span>
        ))}
      </motion.div>

      <div className="w-full overflow-hidden rounded border border-[#E2E6E3] bg-white">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Gráfico Ve, TMB e VO₂ ao longo do tempo"
          className="block w-full max-w-full"
        >
          {/* Grid horizontal (Ve) */}
          {veTicks.map((t) => (
            <line
              key={`h-${t}`}
              x1={PL}
              y1={mapY(t, chart.scales.ve.min, chart.scales.ve.max)}
              x2={PL + plotW}
              y2={mapY(t, chart.scales.ve.min, chart.scales.ve.max)}
              stroke="#E8EBE9"
              strokeWidth="0.75"
            />
          ))}

          {/* Grid vertical */}
          {xTicks.map((m) => (
            <line
              key={`v-${m}`}
              x1={mapX(m, maxMin)}
              y1={PT}
              x2={mapX(m, maxMin)}
              y2={PT + plotH}
              stroke="#E8EBE9"
              strokeWidth="0.75"
            />
          ))}

          {/* Eixo Y esquerdo — Ve */}
          <text
            x={8}
            y={PT + plotH / 2}
            transform={`rotate(-90, 8, ${PT + plotH / 2})`}
            textAnchor="middle"
            className="fill-[#3DAA5C] text-[7px] font-medium"
          >
            Ve (L/min)
          </text>
          {veTicks.map((t) => (
            <text
              key={`vel-${t}`}
              x={PL - 4}
              y={mapY(t, chart.scales.ve.min, chart.scales.ve.max)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#3DAA5C] text-[6.5px] font-mono"
            >
              {t}
            </text>
          ))}

          {/* Eixo Y direito interno — TMB */}
          <text
            x={VB.w - 10}
            y={PT + plotH / 2 - 8}
            transform={`rotate(90, ${VB.w - 10}, ${PT + plotH / 2 - 8})`}
            textAnchor="middle"
            className="fill-[#7B6BA8] text-[7px] font-medium"
          >
            TMB*
          </text>
          {tmbTicks.map((t) => (
            <text
              key={`tmbl-${t}`}
              x={PL + plotW + 3}
              y={mapY(t, chart.scales.tmb.min, chart.scales.tmb.max)}
              textAnchor="start"
              dominantBaseline="middle"
              className="fill-[#7B6BA8] text-[5.5px] font-mono"
            >
              {t}
            </text>
          ))}

          {/* Eixo Y direito externo — VO₂ */}
          <text
            x={VB.w - 2}
            y={PT + plotH / 2 + 10}
            transform={`rotate(90, ${VB.w - 2}, ${PT + plotH / 2 + 10})`}
            textAnchor="middle"
            className="fill-[#B8424F] text-[6px] font-medium"
          >
            VO₂ (mL/Kg·min)
          </text>
          {vo2Ticks.map((t) => (
            <text
              key={`vo2l-${t}`}
              x={VB.w - 4}
              y={mapY(t, chart.scales.vo2.min, chart.scales.vo2.max)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#B8424F] text-[5.5px] font-mono"
            >
              {t % 1 === 0 ? t.toFixed(0) : t.toFixed(1)}
            </text>
          ))}

          {/* Eixo X */}
          {xTicks.map((m) => (
            <text
              key={`x-${m}`}
              x={mapX(m, maxMin)}
              y={PT + plotH + 12}
              textAnchor="middle"
              className="fill-[#666] text-[6.5px] font-mono"
            >
              {m}
            </text>
          ))}
          <text x={PL + plotW / 2} y={VB.h - 6} textAnchor="middle" className="fill-[#666] text-[7px]">
            Tempo (min)
          </text>

          {/* Linhas — ordem: TMB, VO₂, Ve (Ve por cima) */}
          {tmb.path && (
            <path d={tmb.path} fill="none" stroke="#7B6BA8" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {vo2.path && (
            <path d={vo2.path} fill="none" stroke="#B8424F" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {ve.path && (
            <path d={ve.path} fill="none" stroke="#3DAA5C" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          )}

          {/* Marcadores circulares — como referência HandyMET */}
          {ve.pts.map((p, i) => (
            <circle key={`ve-dot-${i}`} cx={p.x} cy={p.y} r="2.2" fill="#3DAA5C" stroke="white" strokeWidth="0.6" />
          ))}
          {tmb.pts.map((p, i) => (
            <circle key={`tmb-dot-${i}`} cx={p.x} cy={p.y} r="2" fill="#7B6BA8" stroke="white" strokeWidth="0.5" />
          ))}
          {vo2.pts.map((p, i) => (
            <circle key={`vo2-dot-${i}`} cx={p.x} cy={p.y} r="2" fill="#B8424F" stroke="white" strokeWidth="0.5" />
          ))}

          {/* Cursor de scan durante animação */}
          {chartActive && drawProgress < 0.995 && (
            <line x1={scanX} y1={PT} x2={scanX} y2={PT + plotH} stroke="rgba(198,100,46,0.25)" strokeWidth="0.75" />
          )}

          {/* Tempo de estabilização */}
          {showStab && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <line x1={stabX} y1={PT} x2={stabX} y2={PT + plotH} stroke="#D97706" strokeWidth="1.2" />
              <text x={stabX + 2} y={PT + 9} className="fill-[#D97706] text-[6px] font-medium">
                Tempo de Estabilização
              </text>
            </motion.g>
          )}

          {/* Rodapé — referência */}
          <text x={PL} y={VB.h - 14} className="fill-[#888] text-[6px]">
            www.handymet.com
          </text>
          <text x={VB.w - PL} y={VB.h - 14} textAnchor="end" className="text-[8px] font-bold">
            <tspan fill="#C4A574">HANDY </tspan>
            <tspan fill="#8B4513">M</tspan>
            <tspan fill="#D97706">E</tspan>
            <tspan fill="#8B4513">T</tspan>
          </text>
        </svg>
      </div>
    </div>
  )
}

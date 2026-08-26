import { motion } from 'framer-motion'
import { readoutSample } from '../../data/readoutSample'
import { useCountUpProgress } from '../../hooks/useCountUp'

const W = 360
const H = 200
const PL = 36
const PR = 44
const PT = 18
const PB = 28
const chartW = W - PL - PR
const chartH = H - PT - PB

function mapX(minute: number, maxMin: number) {
  return PL + (minute / maxMin) * chartW
}

function mapY(value: number, min: number, max: number) {
  return PT + chartH - ((value - min) / (max - min)) * chartH
}

function fullPath(values: readonly number[], minutes: readonly number[], min: number, max: number, maxMin: number) {
  return values
    .map((v, i) => {
      const cmd = i === 0 ? 'M' : 'L'
      return `${cmd}${mapX(minutes[i], maxMin).toFixed(1)},${mapY(v, min, max).toFixed(1)}`
    })
    .join(' ')
}

type MetabolicChartProps = {
  active: boolean
}

export function MetabolicChart({ active }: MetabolicChartProps) {
  const { chart, stabilizationMin } = readoutSample
  const maxMin = chart.minutes[chart.minutes.length - 1]
  const drawProgress = useCountUpProgress(active, 2.4)
  const stabX = mapX(stabilizationMin, maxMin)

  const veFull = fullPath(chart.ve, chart.minutes, chart.scales.ve.min, chart.scales.ve.max, maxMin)
  const vo2Full = fullPath(chart.vo2, chart.minutes, chart.scales.vo2.min, chart.scales.vo2.max, maxMin)
  const tmbFull = fullPath(chart.tmb, chart.minutes, chart.scales.tmb.min, chart.scales.tmb.max, maxMin)

  const showStab = drawProgress >= stabilizationMin / maxMin + 0.05

  return (
    <div className="mt-6 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[320px] w-full" aria-hidden>
        {/* grid */}
        {[0, 4, 8, 12, 16].map((m) => (
          <g key={m}>
            <line
              x1={mapX(m, maxMin)}
              y1={PT}
              x2={mapX(m, maxMin)}
              y2={PT + chartH}
              stroke="#E2E6E3"
              strokeWidth="1"
            />
            <text x={mapX(m, maxMin)} y={H - 6} textAnchor="middle" className="fill-mute text-[8px]">
              {m}
            </text>
          </g>
        ))}

        {/* invisible full paths for length measurement - use stroke-dasharray animation via clip */}
        <defs>
          <clipPath id="chart-clip">
            <rect x={PL} y={0} width={chartW * drawProgress} height={H} />
          </clipPath>
        </defs>

        <g clipPath="url(#chart-clip)">
          <path d={tmbFull} fill="none" stroke="#7B6BA8" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={vo2Full} fill="none" stroke="#C45C6A" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={veFull} fill="none" stroke="#3DAA5C" strokeWidth="2" strokeLinejoin="round" />
        </g>

        {showStab && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <line x1={stabX} y1={PT} x2={stabX} y2={PT + chartH} stroke="#C6642E" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={stabX + 4} y={PT + 10} className="fill-ember text-[7px] font-medium">
              Tempo de Estabilização
            </text>
          </motion.g>
        )}

        <text x={W / 2} y={H - 1} textAnchor="middle" className="fill-mute text-[8px]">
          Tempo (min)
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-mute">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-[#3DAA5C]" /> Ve (L/min)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-[#7B6BA8]" /> TMB*
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-[#C45C6A]" /> VO₂ (ml/Kg·min)
        </span>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { readoutSample, type ExerciseRow } from '../../data/readoutSample'

const silk = [0.22, 1, 0.36, 1] as const

function KcalCell({ value }: { value: string | number }) {
  return <span className="font-mono text-[9px] tabular-nums text-ember sm:text-[11px]">{value}</span>
}

export function ExerciseTable({ active }: { active: boolean }) {
  return (
    <div className="mt-4 w-full max-w-full overflow-hidden rounded border border-line/80">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-[#F7F9F8] text-[#5C6562]">
            <th className="w-[36%] px-1.5 py-2 text-[8px] font-medium leading-tight sm:px-2 sm:text-[11px]">
              Exercício Físico
            </th>
            <th className="w-[11%] px-0.5 py-2 text-center text-[8px] font-medium sm:text-[11px]">METs</th>
            <th className="w-[17%] px-0.5 py-2 text-center text-[8px] font-normal sm:text-[10px]">
              <span className="sm:hidden">20&apos;</span>
              <span className="hidden sm:inline">20 min</span>
            </th>
            <th className="w-[17%] px-0.5 py-2 text-center text-[8px] font-normal sm:text-[10px]">
              <span className="sm:hidden">30&apos;</span>
              <span className="hidden sm:inline">30 min</span>
            </th>
            <th className="w-[19%] px-0.5 py-2 text-center text-[8px] font-normal sm:text-[10px]">
              <span className="sm:hidden">60&apos;</span>
              <span className="hidden sm:inline">60 min</span>
            </th>
          </tr>
          <tr className="border-b border-line bg-[#F7F9F8]/60 text-[#8A9290] sm:hidden">
            <th colSpan={5} className="px-1.5 py-1 text-center text-[7px] font-normal uppercase tracking-wider">
              Gasto calórico (KCal)
            </th>
          </tr>
        </thead>
        <tbody>
          {readoutSample.exercises.map((row: ExerciseRow, i) => (
            <motion.tr
              key={row.name}
              initial={{ opacity: 0, x: -6 }}
              animate={active ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.06 + i * 0.035, ease: silk }}
              className="border-b border-line/60 last:border-0"
            >
              <td className="px-1.5 py-1.5 text-[8px] font-medium leading-snug text-ink sm:px-2 sm:py-2 sm:text-[11px]">
                {row.name}
              </td>
              <td className="px-0.5 py-1.5 text-center text-[8px] tabular-nums text-mute sm:text-[11px]">
                {row.mets}
              </td>
              <td className="px-0.5 py-1.5 text-center">
                <KcalCell value={row.kcal20} />
              </td>
              <td className="px-0.5 py-1.5 text-center">
                <KcalCell value={row.kcal30} />
              </td>
              <td className="px-0.5 py-1.5 text-center">
                <KcalCell value={row.kcal60} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

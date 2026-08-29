import { stats } from '@/data/site'
import { useCountUp } from '@/hooks/useCountUp'
import { Reveal } from './Reveal'

function NumberBlock({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value)
  const isNumeric = /^\d/.test(value)

  return (
    <Reveal>
      <div className="text-center">
        <span
          ref={ref}
          className={`font-display font-black text-yellow ${
            isNumeric ? 'text-[clamp(3rem,8vw,5.5rem)] leading-none' : 'text-[clamp(1.5rem,4vw,2.5rem)] leading-tight'
          }`}
        >
          {display}
        </span>
        <p className="mx-auto mt-3 max-w-[14rem] text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
          {label}
        </p>
      </div>
    </Reveal>
  )
}

export function Numbers() {
  return (
    <section id="numeros" className="relative overflow-hidden bg-green py-20 sm:py-28">
      <div className="absolute inset-0 bg-grain opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.75rem,3vw,2.5rem)] font-black text-white">
            Registros da trajetória
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <NumberBlock key={stat.id} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

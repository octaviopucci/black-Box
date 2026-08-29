import { stats } from '@/data/site'
import { useCountUp } from '@/hooks/useCountUp'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

function NumberBlock({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value)
  const isNumeric = /^\d/.test(value)

  return (
    <div className="relative text-center">
      <div className="mx-auto h-px w-12 bg-yellow/50 lg:hidden" aria-hidden />
      <span
        ref={ref}
        className={`mt-6 block font-display font-black text-yellow lg:mt-0 ${
          isNumeric ? 'text-[clamp(2.75rem,7vw,5rem)] leading-none' : 'text-[clamp(1.35rem,3.5vw,2.25rem)] leading-tight'
        }`}
      >
        {display}
      </span>
      <p className="mx-auto mt-3 max-w-[15rem] text-[11px] font-semibold uppercase leading-snug tracking-[0.18em] text-white/80">
        {label}
      </p>
    </div>
  )
}

export function Numbers() {
  return (
    <section id="numeros" className="section-shell relative overflow-hidden bg-green">
      <div className="absolute inset-0 bg-grain opacity-[0.09]" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,107,60,0.35)_0%,transparent_40%,rgba(0,77,42,0.25)_100%)]" aria-hidden />

      <div className="section-container relative">
        <SectionHeader
          eyebrow="Números"
          title="Registros da trajetória"
          theme="green"
          align="center"
          className="[&_h2]:mx-auto"
        />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 0.05}>
              <NumberBlock value={stat.value} label={stat.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

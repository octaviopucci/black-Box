import { site } from '../data/site'
import { Reveal } from './Reveal'

export function Proof() {
  return (
    <section className="border-y border-line/80 bg-aqua-mist/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.map((item, i) => (
            <Reveal key={item.label} delay={0.06 * i}>
              <div className="text-center sm:text-left">
                <p className="font-display text-[clamp(2.4rem,4vw,3.4rem)] font-semibold leading-none tracking-tight text-navy">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

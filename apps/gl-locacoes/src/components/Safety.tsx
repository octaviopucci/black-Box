import { Reveal } from './Reveal'
import { safety } from '../data/site'

export function Safety() {
  return (
    <section id="seguranca" className="border-y border-line bg-navy-lift/50 px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Segurança</p>
          <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-5xl">
            Regras claras. Pais tranquilos.
          </h2>
          <p className="mt-4 max-w-xl text-paper/65">
            Cada pula-pula sai com placa de orientação. Diversão boa é diversão segura.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safety.map((rule, i) => (
            <Reveal key={rule} delay={i * 0.05}>
              <li className="border border-line bg-navy/40 px-5 py-6">
                <span className="font-brand text-2xl font-bold text-sun">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-sm font-medium leading-relaxed text-paper/85">{rule}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { Reveal } from './Reveal'
import { site } from '../data/site'

export function Credo() {
  return (
    <section id="credo" className="relative px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Quem somos</p>
          <h2 className="display-title mt-4 max-w-3xl text-3xl text-paper sm:text-5xl">
            Diversão para a criançada.
            <span className="block text-sun">Tranquilidade para quem organiza.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal delay={0.08}>
            <p className="max-w-xl text-lg leading-relaxed text-paper/75">{site.promise}</p>
            <p className="mt-5 max-w-xl text-paper/60">
              Em Capão Bonito e região, a G&amp;L Locações leva pula-pula, piscina de bolinhas,
              escorregadores e toboágua até a sua festa. Montagem profissional. Atendimento próximo.
              Resultado que se sente no sorriso das crianças.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <ul className="space-y-4 border-l border-sun/40 pl-6">
              {[
                'Equipamentos limpos e com rede de proteção',
                'Montagem e desmontagem inclusas',
                'Combos pensados para espaços reais',
                'Reserva rápida pelo WhatsApp',
              ].map((item) => (
                <li key={item} className="text-sm font-medium text-paper/80 sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { Reveal } from '../ui/Reveal'

export function Positioning() {
  return (
    <section className="bb-section">
      <div className="bb-container">
        <Reveal>
          <p className="bb-eyebrow mb-8">Posicionamento</p>
          <h2 className="bb-display max-w-5xl text-[clamp(2.2rem,6vw,5rem)]">
            Não construímos apenas sites.
            <span className="mt-3 block text-silver">Construímos sistemas.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal delay={0.08}>
            <p className="max-w-md text-xl leading-relaxed text-paper/90 sm:text-2xl">
              Uma interface bonita chama atenção.
              <br />
              Um sistema bem construído transforma uma operação.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-lg text-base leading-relaxed text-mute sm:text-lg">
              Na Black Box, combinamos engenharia de software, inteligência artificial, automação e
              design para transformar problemas de negócio em soluções digitais.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

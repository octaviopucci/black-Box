import { Reveal } from '../ui/Reveal'

export function About() {
  return (
    <section id="sobre" className="bb-section border-t border-white/10">
      <div className="bb-container max-w-4xl">
        <Reveal>
          <p className="bb-eyebrow mb-6">Sobre</p>
          <h2 className="bb-display text-[clamp(2rem,5vw,4rem)]">
            Não se trata apenas de construir.
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-mute sm:text-lg">
            <p>
              A Black Box existe para transformar ideias, processos e problemas complexos em
              sistemas digitais que realmente funcionam.
            </p>
            <p>
              Unimos tecnologia, inteligência artificial, automação e design para construir
              soluções sob medida.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

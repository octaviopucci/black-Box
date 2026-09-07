import { Reveal } from '../ui/Reveal'

export function About() {
  return (
    <section id="sobre" className="bb-section border-t border-white/10">
      <div className="bb-container max-w-4xl">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mute">Sobre</p>
          <h2 className="font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-paper sm:text-4xl lg:text-5xl">
            Tecnologia de verdade, sem complicação
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-mute sm:text-lg">
            <p>
              A Black Box existe para transformar ideias e problemas do dia a dia em sistemas que
              funcionam de verdade — e que qualquer pessoa da sua equipe consegue usar.
            </p>
            <p>
              Unimos design, inteligência artificial e automação para entregar soluções sob medida.
              Você não precisa entender de código. Precisa de resultado.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

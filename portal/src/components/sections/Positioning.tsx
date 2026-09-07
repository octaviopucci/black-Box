import { Reveal } from '../ui/Reveal'

export function Positioning() {
  return (
    <section className="bb-section">
      <div className="bb-container">
        <Reveal>
          <h2 className="bb-display max-w-4xl text-[clamp(2rem,5.5vw,4.2rem)] normal-case leading-[1.05]">
            Não fazemos só site bonito.
            <span className="mt-4 block text-silver">Fazemos o que muda o seu negócio.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal delay={0.08}>
            <p className="max-w-md text-xl leading-relaxed text-paper/90 sm:text-2xl">
              Site bonito chama atenção.
              <br />
              <span className="text-mute">Sistema bem feito muda resultado.</span>
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-lg text-base leading-relaxed text-mute sm:text-lg">
              A Black Box une design, inteligência artificial e automação para resolver problemas reais:
              vender mais, atender melhor, recuperar clientes e eliminar retrabalho — sem complicar a
              vida de quem usa.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

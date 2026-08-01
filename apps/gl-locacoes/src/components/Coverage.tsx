import { MapPin } from 'lucide-react'
import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function Coverage() {
  return (
    <section id="cobertura" className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Onde estamos</p>
          <h2 className="display-title mt-4 text-3xl sm:text-5xl">
            Levamos a diversão onde você estiver.
          </h2>
          <p className="mt-5 flex items-start gap-3 text-lg text-paper/75">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-sun" />
            Atendemos {site.city}, com montagem no local da sua festa.
          </p>
          <p className="mt-4 max-w-md text-paper/60">
            Aniversários, festa junina, eventos de rua ou celebração em família. Conte a data e o
            endereço. Nós confirmamos o deslocamento e o melhor brinquedo para o espaço.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <img
            src={asset('moments/ig-05.jpg')}
            alt="Equipe G&L Locações em atendimento com uniforme da marca"
            className="aspect-[4/5] w-full object-cover object-top"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}

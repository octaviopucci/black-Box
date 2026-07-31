import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function Doorway() {
  return (
    <section className="relative overflow-hidden bg-wine-deep px-5 py-20 text-cream sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <Reveal>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
            Entre
          </p>
          <h2 className="display-title text-4xl text-cream sm:text-5xl lg:text-6xl">
            O físico começa na fachada burgundy.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
            Veludo, luz quente, boiserie. Você não chega a um consultório frio. Você chega a um
            espaço pensado para o seu ritmo.
          </p>
          <Link
            to="/espaco"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-rose-soft"
            data-cursor
          >
            Percorrer o espaço
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden rounded-[2rem]">
          <img
            src={asset('space/reception.jpg')}
            alt={`Recepção da ${site.clinic}`}
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/75 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 font-script text-2xl text-rose-soft sm:text-3xl">
            Recepção Matsubara
          </p>
        </Reveal>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function CraftTeaser() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <Reveal className="relative overflow-hidden rounded-[2rem] order-2 lg:order-1">
            <img
              src={asset('care/odontologia.jpg')}
              alt="Cuidado odontológico na Clínica Matsubara"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </Reveal>

          <Reveal delay={0.08} className="order-1 lg:order-2">
            <p className="eyebrow">
              <span className="h-px w-8 bg-wine" />
              {site.craft.title}
            </p>
            <h2 className="display-title text-4xl text-ink sm:text-5xl">{site.craft.line}</h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-mute sm:text-base">
              {site.craft.detail}
            </p>

            <ol className="mt-8 space-y-4">
              {site.journey.map((step) => (
                <li key={step.step} className="flex gap-4 border-t border-line pt-4">
                  <span className="font-display text-2xl text-wine">{step.step}</span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm text-mute">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link to="/endodontia" className="cta-wine mt-10" data-cursor>
              Entender a endodontia
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

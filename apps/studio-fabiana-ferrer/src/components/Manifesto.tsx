import { brand, pillars } from '@/data/site'
import Reveal from './Reveal'

export default function Manifesto() {
  return (
    <section className="border-t hairline px-5 py-20 md:px-10 md:py-28" aria-label="Posicionamento">
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <p className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.08] tracking-[-0.02em] text-accent text-balance">
            {pillars.map((p) => p.title).join(' · ')}
          </p>
          <p className="mt-8 max-w-measure text-base leading-relaxed text-mute md:text-lg">
            {brand.promise}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

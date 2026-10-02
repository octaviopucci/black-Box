import { philosophy } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Philosophy() {
  return (
    <section className="border-y border-line bg-ink-lift/40 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">Essência</p>
          <blockquote className="display-title max-w-[18ch] text-[clamp(2rem,5vw,3.75rem)] text-paper">
            {philosophy.headline}
          </blockquote>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-paper/65 md:text-lg">
            {philosophy.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

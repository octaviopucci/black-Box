import { evidence } from '@/data/site'
import Reveal from './Reveal'

export default function Evidence() {
  return (
    <section className="border-t hairline bg-ink text-paper" aria-label="Fotos reais">
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <h2 className="max-w-prose font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            Na prática — imagens do Instagram oficial.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px bg-paper/10 md:grid-cols-2 lg:grid-cols-3">
          {evidence.map((item) => (
            <Reveal key={item.src}>
              <figure className="bg-ink">
                <img
                  src={`${import.meta.env.BASE_URL}${item.src}`}
                  alt={item.alt}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="px-1 py-4 text-[0.72rem] leading-relaxed text-paper/55">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

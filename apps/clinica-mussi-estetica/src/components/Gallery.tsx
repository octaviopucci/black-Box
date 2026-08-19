import { media } from '@/data/site'
import { Reveal } from './Reveal'

export function Gallery() {
  return (
    <section className="border-t border-ink/8 bg-paper-lift px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Instagram</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-ink">
            Fotos reais do perfil @clinicamussiestetica
          </h2>
        </Reveal>

        <div className="mt-12 columns-2 gap-4 md:columns-3 md:gap-5">
          {media.gallery.map((src, index) => (
            <Reveal key={src} delay={index * 0.04} className="mb-4 break-inside-avoid md:mb-5">
              <img
                src={src}
                alt={`Publicação ${index + 1} da Clínica Mussi no Instagram`}
                className="w-full object-cover"
                loading="lazy"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

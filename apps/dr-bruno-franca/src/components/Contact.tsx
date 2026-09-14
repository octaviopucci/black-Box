import { site } from '@/data/site'
import { InstagramIcon } from '@/components/InstagramIcon'
import { Reveal } from '@/components/Reveal'

export function Contact() {
  return (
    <section id="contato" className="border-t border-line bg-ink-lift/30 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-6 justify-center">Contato</p>
            <h2 className="display-title text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
              Próximo passo: uma conversa
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-paper/60">
              Agende sua avaliação pelo Instagram. Cada tratamento começa com escuta,
              planejamento e respeito às suas características.
            </p>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary mt-10 inline-flex"
            >
              <InstagramIcon className="h-4 w-4" />
              @{site.handle}
            </a>
            <p className="mt-8 text-sm text-paper/40">{site.location}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

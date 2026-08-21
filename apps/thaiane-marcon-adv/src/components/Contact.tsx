import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Contact() {
  return (
    <section id="contato" className="bg-sheet px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="section-rule mb-16" />
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-[0.72rem] font-semibold tracking-mark text-accent uppercase">
                Contato
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] text-ink">
                Entre em contato.
              </h2>
              <p className="mt-6 max-w-measure text-lg leading-relaxed text-mute">
                Tire dúvidas sobre seu caso ou agende uma conversa. Resposta direta, sem
                formulários intermediários.
              </p>
            </div>
            <div className="md:text-right">
              <a
                href={site.cta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-accent-deep"
              >
                {site.cta.label}
              </a>
              <p className="mt-4 text-sm text-mute">
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  instagram.com/{site.instagram.handle}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

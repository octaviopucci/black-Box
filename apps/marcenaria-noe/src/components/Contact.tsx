import { ArrowUpRight } from 'lucide-react'
import { InstagramIcon } from '@/components/InstagramIcon'
import { Reveal } from '@/components/Reveal'
import { site, whatsappHref } from '@/data/site'

export function Contact() {
  return (
    <section id="contato" className="relative overflow-hidden px-5 py-28 md:px-10 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184,149,108,0.2), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow mb-4">Contato</p>
          <h2 className="display-title max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] text-paper">
            Solicite um orçamento
          </h2>
          <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-paper/60">
            Conte sobre o ambiente ou projeto especial que você imagina. Respondemos pelo
            WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a href={whatsappHref()} className="cta-brass group text-base">
              WhatsApp
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost group"
            >
              <InstagramIcon className="size-4" />
              @{site.handle}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

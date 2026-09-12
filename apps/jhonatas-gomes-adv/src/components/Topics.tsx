import { site } from '@/data/site'
import { Eyebrow, Reveal } from '@/components/Reveal'

export function Topics() {
  return (
    <section id="atuacao" className="relative bg-paper py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <Eyebrow>Atuação</Eyebrow>
          <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-tight text-ink">
            Situações que o trabalhador enfrenta no dia a dia
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute md:text-lg">
            Temas recorrentes no conteúdo de @{site.instagram.handle} — cada caso exige
            análise individual, mas conhecer o direito é o primeiro passo.
          </p>
        </Reveal>

        <div className="mt-16 space-y-0 border-t border-line">
          {site.topics.map((topic, index) => (
            <Reveal key={topic.id} delay={index * 0.06}>
              <article className="group grid gap-8 border-b border-line py-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-14 md:py-14">
                <div className="order-2 md:order-1">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-gold-deep">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                    {topic.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-mute">{topic.summary}</p>
                  <a
                    href={topic.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex text-sm font-semibold text-navy underline-offset-4 transition hover:text-gold-deep hover:underline"
                  >
                    Ver no Instagram
                  </a>
                </div>
                <a
                  href={topic.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-1 overflow-hidden md:order-2"
                  aria-label={`Abrir post sobre ${topic.title}`}
                >
                  <img
                    src={topic.image}
                    alt=""
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

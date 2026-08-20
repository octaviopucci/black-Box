import { educationPosts } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Education() {
  return (
    <section id="dicas" className="bg-mar-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
            Saúde bucal
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
            Dicas que a clínica compartilha no dia a dia.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mar-ink-soft">
            Conteúdo educativo do Instagram oficial — toque em cada tema para ver
            o post completo.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-0 divide-y divide-mar-line border-y border-mar-line md:grid-cols-2 md:divide-x md:divide-y-0">
          {educationPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.06}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between p-8 transition-colors hover:bg-mar-mist md:p-10"
              >
                <div>
                  <span className="font-display text-4xl text-mar-peach/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-[clamp(1.35rem,2.5vw,1.65rem)] leading-tight text-mar-ink transition-colors group-hover:text-mar-rose-deep">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mar-ink-soft">
                    {post.excerpt}
                  </p>
                </div>
                <p className="mt-8 text-xs uppercase tracking-[0.2em] text-mar-wave transition-colors group-hover:text-mar-rose-deep">
                  Ver no Instagram →
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

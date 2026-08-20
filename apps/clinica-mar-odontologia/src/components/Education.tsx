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
            Conteúdo educativo extraído do Instagram oficial — sem promessas
            genéricas, com orientação prática.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {educationPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.06}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid overflow-hidden bg-mar-mist md:grid-cols-[140px_1fr]"
              >
                <div className="aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[180px]">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-tide group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <h3 className="font-display text-[clamp(1.35rem,2.5vw,1.65rem)] leading-tight text-mar-ink transition-colors group-hover:text-mar-rose-deep">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mar-ink-soft">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-mar-wave">
                    {post.source}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

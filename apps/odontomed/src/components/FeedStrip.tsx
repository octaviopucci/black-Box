import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function FeedStrip() {
  return (
    <section className="overflow-hidden bg-paper px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-eyebrow">Instagram</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1] text-ink">
            Registros reais do consultório.
          </h2>
        </Reveal>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {site.instagramPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.04} className="min-w-[min(82vw,320px)] shrink-0">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <img
                  src={post.image}
                  alt=""
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">{post.caption}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

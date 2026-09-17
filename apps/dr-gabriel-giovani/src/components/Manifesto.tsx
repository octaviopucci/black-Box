import { site } from '@/data/site'

export function Manifesto() {
  return (
    <section className="border-b border-line bg-paper px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Missão</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
            {site.manifesto.lead}
          </h2>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-lg leading-[1.75] text-mute md:text-xl">{site.manifesto.body}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-mute/70">{site.manifesto.source}</p>
        </div>
      </div>
    </section>
  )
}

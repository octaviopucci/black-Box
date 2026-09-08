import { audiences, audienceIntro } from '../data/site'

export function Audience() {
  return (
    <section className="relative bg-ink px-6 py-28 text-paper sm:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow-light">Para quem é</p>
        <h2 className="display-title max-w-lg text-[clamp(2rem,4.4vw,3rem)]">Um exame, dois caminhos</h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-paper/72">{audienceIntro}</p>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-12">
          {audiences.map((item, i) => (
            <div key={item.title} className="border-t border-paper/15 pt-6">
              <span className="font-mono text-xs text-teal-bright">{`0${i + 1}`}</span>
              <h3 className="mt-3 font-display text-xl leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

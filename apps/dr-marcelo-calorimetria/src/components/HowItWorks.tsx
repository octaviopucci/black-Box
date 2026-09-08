import { journey, site, asset } from '../data/site'

const devicePhoto = asset(site.media.devicePhoto)

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative overflow-hidden bg-ink px-6 py-28 text-paper sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 85% 0%, rgba(47,166,160,0.16), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <p className="eyebrow-light">Como funciona</p>
        <h2 className="display-title max-w-md text-[clamp(2rem,4.4vw,3rem)]">
          Uma respiração tranquila. Um número exato.
        </h2>

        <div className="mt-12 overflow-hidden rounded-sm bg-paper/5 ring-1 ring-paper/10">
          <img
            src={devicePhoto}
            alt="Analisador metabólico portátil VO2 Master com máscara respiratória"
            className="mx-auto block w-full max-w-md"
            width={554}
            height={554}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-14 space-y-10">
          {journey.map((step) => (
            <div key={step.step} className="flex gap-6 border-t border-paper/12 pt-6">
              <span className="font-mono text-sm text-teal-bright">{step.step}</span>
              <div>
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-paper/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

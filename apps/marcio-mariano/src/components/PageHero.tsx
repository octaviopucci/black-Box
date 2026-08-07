import { Reveal } from './Reveal'

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden bg-blue-deep pt-28 text-white sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(249,195,34,0.18),transparent_45%),radial-gradient(ellipse_at_90%_30%,rgba(0,67,149,0.5),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-shell px-5 pb-14 sm:px-8 sm:pb-16">
        <Reveal>
          <p className="section-label !text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

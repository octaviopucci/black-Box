import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

function WalkPanel({
  item,
  index,
}: {
  item: (typeof site.spaceWalk)[number]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  const reverse = index % 2 === 1

  return (
    <article
      ref={ref}
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
        reverse ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-wine">
          0{index + 1} · {item.title}
        </p>
        <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{item.title}</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mute sm:text-base">{item.line}</p>
      </Reveal>

      <div className="relative overflow-hidden rounded-[1.75rem] shadow-soft">
        <motion.img
          style={{ y }}
          src={asset(item.image)}
          alt={`${item.title} — ${site.clinic}`}
          className="aspect-[5/4] w-full scale-110 object-cover"
          loading="lazy"
        />
      </div>
    </article>
  )
}

export function Espaco() {
  return (
    <section id="espaco" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl sm:mb-20">
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine" />
            O espaço
          </p>
          <h2 className="display-title text-4xl text-ink sm:text-5xl lg:text-6xl">
            Entre no físico pelo digital.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">
            A Matsubara em Capão Bonito não é só endereço. É o ambiente onde a escuta acontece —
            veludo burgundy, luz quente e um consultório pensado para o seu conforto.
          </p>
        </Reveal>

        <div className="flex flex-col gap-16 sm:gap-24">
          {site.spaceWalk.map((item, index) => (
            <WalkPanel key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

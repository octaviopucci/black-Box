import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset, site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Story() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-story]',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="historia"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-paper py-28 text-ink sm:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-12 md:gap-10 md:pl-28">
        <div className="md:col-span-5">
          <motion.div style={{ y }} className="relative overflow-hidden">
            <img
              src={asset('hero-1.jpg')}
              alt="Equipe da Clínica DNA em consulta"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
        </div>

        <div className="md:col-span-7">
          <p data-story className="text-[11px] font-semibold uppercase tracking-[0.38em] text-mute">
            Desde {site.since} · Capão Bonito
          </p>
          <h2
            data-story
            className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight"
          >
            O DNA do cuidado é a conexão
          </h2>
          <div className="mt-8 space-y-5">
            {site.story.map((p) => (
              <p key={p} data-story className="text-base leading-relaxed text-mute sm:text-lg">
                {p}
              </p>
            ))}
          </div>

          <div data-story className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { k: 'Capão Bonito', v: 'No centro da cidade' },
              { k: 'Multidisciplinar', v: 'Especialidades unidas' },
              { k: 'WhatsApp', v: 'Agendamento humano' },
            ].map((item) => (
              <div key={item.k} className="border-t border-line pt-4">
                <p className="font-display text-xl font-semibold">{item.k}</p>
                <p className="mt-1 text-sm text-mute">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

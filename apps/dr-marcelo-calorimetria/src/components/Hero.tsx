import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { site, bookingUrl } from '../data/site'
import { BreathWave } from './BreathWave'

const headlineWords = site.headline.split(' ')

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const waveY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const waveOpacity = useTransform(scrollYProgress, [0, 0.8], [0.9, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      id="topo"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 18% 8%, rgba(47,166,160,0.22), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(198,100,46,0.14), transparent 55%), linear-gradient(180deg, #0A1211 0%, #0B1917 55%, #0A1211 100%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-28 pb-16">
        <motion.div style={{ y: contentY }} className="mx-auto w-full max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow-light"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
            {site.specialty} · {site.crm}
          </motion.p>

          <h1 className="display-title max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="mr-[0.28em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-paper/75"
          >
            {site.support}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-solid">
              Agendar exame
            </a>
            <a href="#como-funciona" className="cta-ghost-light">
              Como funciona
              <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={{ y: waveY, opacity: waveOpacity }} className="relative z-10 pb-10">
        <BreathWave tone="light" className="mx-auto h-16 w-full max-w-none opacity-90" />
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-paper/40">
          {site.examTagline}
        </p>
      </motion.div>
    </section>
  )
}

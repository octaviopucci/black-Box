import { motion } from 'framer-motion'
import { evidence } from '@/data/site'
import { useMotion } from '@/hooks/useMotion'
import Reveal from './Reveal'

export default function Evidence() {
  const { stagger } = useMotion()

  return (
    <section className="px-4 py-16 md:px-8 md:py-24" aria-label="Evidências visuais">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">Na prática</p>
          <h2 className="mt-3 max-w-prose font-display text-3xl font-medium text-forest md:text-4xl">
            Fotos reais do Instagram — procedimentos, resultados e bastidores.
          </h2>
        </Reveal>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {evidence.map((item, index) => (
            <Reveal key={item.src} delay={stagger * (index % 3)}>
              <motion.figure
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-forest/8 bg-paper shadow-tactile"
              >
                <img
                  src={`${import.meta.env.BASE_URL}${item.src}`}
                  alt={item.alt}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="px-4 py-3 text-xs font-medium text-smoke">
                  {item.caption}
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

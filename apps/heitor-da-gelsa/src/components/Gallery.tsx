import { useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { galleryFilters, galleryItems } from '@/data/site'
import { Reveal } from './Reveal'

export function Gallery() {
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]>('Todos')
  const [lightbox, setLightbox] = useState<(typeof galleryItems)[number] | null>(null)

  const filtered =
    filter === 'Todos' ? galleryItems : galleryItems.filter((item) => item.category === filter)

  return (
    <section id="galeria" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Galeria</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Registros da atuação
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {galleryFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
                filter === f
                  ? 'bg-green text-white'
                  : 'bg-green/10 text-green hover:bg-green/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.04} className="mb-4 break-inside-avoid">
              <button
                type="button"
                className="group w-full overflow-hidden rounded-sm"
                onClick={() => setLightbox(item)}
                aria-label={`Abrir foto: ${item.alt}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-graphite/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Fechar galeria"
              onClick={() => setLightbox(null)}
            >
              <X size={22} />
            </button>
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-full rounded-sm object-contain"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

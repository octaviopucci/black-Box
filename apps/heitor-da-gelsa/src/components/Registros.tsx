import { useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { galleryItems, instagramPosts, siteConfig, videos } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function Registros() {
  const [lightbox, setLightbox] = useState<(typeof galleryItems)[number] | null>(null)

  return (
    <section id="registros" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Registros</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Fotos e publicações reais
          </h2>
          <p className="mt-4 max-w-2xl text-graphite/75">
            Seleção documental do Instagram @heitordagelsa — fotografia completa, sem artes de campanha.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <button
                type="button"
                className="group w-full overflow-hidden bg-green-deep/5"
                onClick={() => setLightbox(item)}
                aria-label={`Abrir foto: ${item.alt}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                  loading="lazy"
                />
                <p className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-green">
                  {item.category}
                </p>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 border-t border-green/10 pt-16">
          <Reveal>
            <h3 className="font-display text-2xl font-black text-green-deep">Publicações destacadas</h3>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {instagramPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.05}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden border border-green/10 sm:flex-row"
                >
                  <div className="sm:w-[180px] sm:shrink-0">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="aspect-[3/4] h-full w-full object-cover object-center sm:aspect-auto sm:min-h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-green">{post.category}</p>
                    <h4 className="mt-2 font-display text-lg font-bold leading-snug text-green-deep">{post.title}</h4>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-graphite/70">{post.caption}</p>
                    <span className="mt-3 text-xs font-bold uppercase tracking-wide text-green group-hover:text-green-dark">
                      Ver no Instagram →
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-green/10 pt-16">
          <Reveal>
            <h3 className="font-display text-2xl font-black text-green-deep">Em vídeo</h3>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {videos.map((video, i) => (
              <Reveal key={video.id} delay={i * 0.05}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="aspect-[9/16] max-h-[420px] overflow-hidden bg-green-deep/5">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover object-center transition-transform group-hover:scale-[1.015]"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-green">{video.category}</p>
                  <p className="mt-1 font-semibold text-graphite">{video.title}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/conteudos" variant="primary">
              Ver todos os conteúdos
            </Button>
            <Button href={siteConfig.instagramUrl} variant="outline" external>
              Instagram @heitordagelsa
            </Button>
          </div>
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
              className="max-h-[90vh] max-w-full object-contain"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import { useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { instagramPosts, siteConfig } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function Registros() {
  const [lightbox, setLightbox] = useState<(typeof instagramPosts)[number] | null>(null)

  return (
    <section id="registros" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Registros</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Publicações do Instagram
          </h2>
          <p className="mt-4 max-w-2xl text-graphite/75">
            Seleção documental de @heitordagelsa — cada registro aparece uma vez, com link para o post original.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <article className="group flex h-full flex-col overflow-hidden border border-green/10">
                <button
                  type="button"
                  className="overflow-hidden bg-green-deep/5 text-left"
                  onClick={() => setLightbox(post)}
                  aria-label={`Ampliar foto: ${post.title}`}
                >
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                    loading="lazy"
                  />
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-green">{post.category}</p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-green-deep">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite/70">{post.caption}</p>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-xs font-bold uppercase tracking-wide text-green hover:text-green-dark"
                  >
                    Ver no Instagram →
                  </a>
                </div>
              </article>
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
              src={lightbox.thumbnail}
              alt={lightbox.title}
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

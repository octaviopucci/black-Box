import { useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { instagramPosts, siteConfig } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function Registros() {
  const [lightbox, setLightbox] = useState<(typeof instagramPosts)[number] | null>(null)

  return (
    <section id="registros" className="section-shell bg-paper-warm">
      <div className="section-container">
        <SectionHeader
          eyebrow="Registros"
          title="Publicações do Instagram"
          description="Seleção documental de @heitordagelsa — cada registro aparece uma vez, com link para o post original."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-green/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <button
                  type="button"
                  className="relative overflow-hidden bg-green-deep/5 text-left"
                  onClick={() => setLightbox(post)}
                  aria-label={`Ampliar foto: ${post.title}`}
                >
                  <span className="absolute left-4 top-4 z-10 rounded-sm bg-green-deep/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow backdrop-blur-sm">
                    {post.category}
                  </span>
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="aspect-[3/4] w-full object-cover object-center transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </button>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">{post.date}</p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-green-deep">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{post.caption}</p>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green transition-colors hover:text-green-dark"
                  >
                    Ver no Instagram
                    <ExternalLink size={14} aria-hidden />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-graphite/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Fechar galeria"
              onClick={() => setLightbox(null)}
            >
              <X size={22} />
            </button>
            <motion.figure
              className="max-h-[90vh] max-w-5xl"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.thumbnail} alt={lightbox.title} className="max-h-[78vh] w-full object-contain" />
              <figcaption className="mt-4 text-center">
                <p className="font-display text-lg font-bold text-white">{lightbox.title}</p>
                <p className="mt-1 text-sm text-white/60">{lightbox.caption}</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

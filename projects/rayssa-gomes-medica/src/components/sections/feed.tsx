'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { feedPosts, site } from '@/data/site'

export function Feed() {
  const reduce = useReducedMotion()

  return (
    <section id="conteudo" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="eyebrow">Conteúdo</p>
            <h2 className="display-title mt-4 text-[clamp(2rem,4vw,3rem)] text-ink">
              Saúde explicada com clareza — do consultório ao feed.
            </h2>
          </div>
          <Link
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent transition hover:text-brand-accent/80"
          >
            Ver no Instagram
            <ArrowUpRight className="size-4" />
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {feedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group"
            >
              <Link
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-mute transition group-hover:text-ink">
                  {post.excerpt}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

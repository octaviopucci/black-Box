'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { media, site } from '@/data/site'

export function Essence() {
  const reduce = useReducedMotion()

  return (
    <section id="essencia" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <Image
            src={media.profile}
            alt={site.shortName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Essência</p>
          <h2 className="display-title mt-4 text-balance text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
            {site.tagline}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mute">{site.description}</p>
          <blockquote className="mt-8 border-l-2 border-brand-accent pl-5 text-lg italic leading-relaxed text-ink/85">
            “{site.promise}”
          </blockquote>
          <p className="mt-8 text-sm font-medium text-ink/70">
            {site.shortName} · {site.crm}
            <br />
            Sócia-fundadora · {site.clinic.name} · {site.clinic.city}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

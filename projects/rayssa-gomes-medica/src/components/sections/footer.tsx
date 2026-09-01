'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { site, whatsappUrl } from '@/data/site'

export function CtaSection() {
  const reduce = useReducedMotion()

  return (
    <section id="agendar" className="bg-fern py-24 text-paper md:py-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-6 text-center md:px-8"
      >
        <p className="eyebrow text-paper/60">Agendar</p>
        <h2 className="display-title mx-auto mt-4 max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
          Seu cuidado começa com uma conversa.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base text-paper/75">
          Consultas na {site.clinic.name}, {site.clinic.city}. Agende pelo WhatsApp
          e receba orientação sobre horários e documentos.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-accent/90"
          >
            WhatsApp · Agendar
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <p className="mt-8 inline-flex items-center justify-center gap-2 text-sm text-paper/65">
          <MapPin className="size-4 shrink-0" />
          {site.clinic.address}
        </p>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-ink/8 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-heading text-2xl font-medium text-ink">{site.shortName}</p>
          <p className="mt-1 text-sm text-mute">
            {site.specialty} · {site.crm}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-mute md:items-end">
          <Link
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-fern"
          >
            {site.instagramHandle}
          </Link>
          <Link
            href={site.clinic.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-fern"
          >
            {site.clinic.instagramHandle}
          </Link>
          <p className="text-xs text-mute/80">
            Landing criada via Black Box · Next.js standalone
          </p>
        </div>
      </div>
    </footer>
  )
}

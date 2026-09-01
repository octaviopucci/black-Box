'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/data/site'

export function Navbar() {
  const reduce = useReducedMotion()

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-ink/8 bg-paper/82 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link href="#topo" className="group flex flex-col leading-none">
          <span className="font-heading text-lg font-medium tracking-tight text-ink">
            {site.name}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-mute">
            {site.crm}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/70 transition hover:text-fern"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#agendar"
          className="inline-flex items-center gap-1.5 rounded-full bg-fern px-4 py-2 text-sm font-semibold text-paper transition hover:bg-fern/90"
        >
          Agendar
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </motion.header>
  )
}

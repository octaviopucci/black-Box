'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  const { hero } = siteConfig

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-36 text-white lg:pt-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_20%,#b8541c_0%,#7a3212_55%,#3a1608_100%)]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(45% 38% at 12% 15%, rgba(255,170,110,0.55), transparent 70%), radial-gradient(50% 42% at 90% 10%, rgba(90,40,15,0.6), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,10,0.72) 0%, transparent 22%, transparent 45%, rgba(8,8,10,0.55) 72%, rgba(8,8,10,1) 100%)',
        }}
      />
      <div className="grain absolute inset-0" aria-hidden />

      <div className="hero-float-a pointer-events-none absolute left-[6%] top-[15%] h-16 w-16 rounded-full border border-white/20 opacity-60" />
      <div className="hero-float-b pointer-events-none absolute right-[8%] top-[55%] h-12 w-12 rounded-full bg-accent/30 opacity-70 blur-sm" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-16 lg:flex-row lg:items-end lg:justify-between lg:pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-2xl"
        >
          <motion.p variants={rise} className="text-eyebrow mb-4 text-white/70">
            {hero.eyebrow}
          </motion.p>
          <motion.h1 variants={rise} className="text-hero font-bold">
            {hero.headline}
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-lg text-lg text-white/80">
            {hero.subheadline}
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-4">
            <Link
              href={hero.ctaPrimary.href}
              className="btn-shine rounded-xl bg-accent px-6 py-3 font-semibold text-white"
            >
              {hero.ctaPrimary.label}
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {hero.ctaSecondary.label}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-12 flex h-48 w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm lg:mt-0"
        >
          <span className="text-sm text-white/50">Visual / mascote → public/hero.webp</span>
        </motion.div>
      </div>

      <motion.ul
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 mx-auto flex max-w-6xl flex-wrap gap-4 px-6 pb-10"
      >
        {hero.badges.map((badge) => (
          <li
            key={badge}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/90"
          >
            {badge}
          </li>
        ))}
      </motion.ul>
    </section>
  )
}

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { brand, nav } from '@/data/site'
import BrandMark from './BrandMark'

export default function Nav() {
  const [active, setActive] = useState('inicio')
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 48)
  })

  useEffect(() => {
    const sections = nav.map((item) => document.getElementById(item.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] },
    )
    sections.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-8"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-3 backdrop-blur-xl transition-shadow duration-500 md:px-6 ${
          scrolled
            ? 'bg-paper/94 shadow-[0_1px_0_rgba(116,198,157,0.16),0_12px_40px_-20px_rgba(27,67,50,0.18)]'
            : 'bg-paper/72 shadow-[0_1px_0_rgba(116,198,157,0.08)]'
        }`}
      >
        <a href="#inicio" aria-label={brand.short}>
          <BrandMark />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-full px-3 py-2 text-[0.78rem] font-medium transition-colors ${
                active === item.id
                  ? 'bg-forest text-paper'
                  : 'text-smoke hover:bg-veil hover:text-forest'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={brand.instagramDm}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-forest px-4 py-2.5 text-[0.78rem] font-semibold text-paper shadow-tactile transition hover:bg-pine"
        >
          {brand.cta}
        </a>
      </div>
    </motion.header>
  )
}

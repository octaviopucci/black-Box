"use client"

import { site, whatsappUrl } from "@/data/site"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-[hsl(var(--ink)/0.08)] bg-[hsl(var(--paper)/0.92)] backdrop-blur-md"
          : "bg-transparent",
      )}
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[4.5rem] md:px-8">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-[hsl(var(--ink))] md:text-2xl"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.slice(0, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[hsl(var(--mute))] transition-colors hover:text-[hsl(var(--ink))]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--paper))] transition hover:bg-[hsl(var(--accent-deep))]"
          >
            Agendar
          </a>
        </nav>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-[hsl(var(--paper))] md:hidden"
        >
          Agendar
        </a>
      </div>
    </motion.header>
  )
}

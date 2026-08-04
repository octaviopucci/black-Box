'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BRAND, ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'
import { fadeIn, scaleIn } from '@/animations/variants'

export default function SplashPage() {
  const router = useRouter()
  const onboardingDone = useAppStore((s) => s.onboardingDone)

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(onboardingDone ? ROUTES.home : ROUTES.onboarding)
    }, 2000)
    return () => clearTimeout(timer)
  }, [router, onboardingDone])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center"
      >
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-[#9333ea] to-accent text-3xl font-bold text-white shadow-2xl shadow-primary/30"
        >
          CB
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-8 text-4xl font-bold tracking-tight text-foreground"
        >
          {BRAND.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-2 text-lg text-muted-foreground"
        >
          {BRAND.slogan}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex gap-1.5"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

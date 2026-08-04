'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BRAND, ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'
import { assetPath } from '@/lib/asset-path'
import { fadeIn, scaleIn } from '@/animations/variants'

export default function SplashPage() {
  const router = useRouter()
  const onboardingDone = useAppStore((s) => s.onboardingDone)

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(onboardingDone ? ROUTES.home : ROUTES.onboarding)
    }, 2400)
    return () => clearTimeout(timer)
  }, [router, onboardingDone])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6">
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
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath('/brand/logo.png')}
            alt={BRAND.name}
            width={280}
            height={280}
            className="h-auto w-[min(72vw,280px)] object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.45)]"
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex gap-1.5"
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

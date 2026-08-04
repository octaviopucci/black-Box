'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, X, Volume2, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { adsService } from '@/services/ads-service'
import { useAdsStore } from '@/stores/ads-store'
import { AD_PLACEMENTS } from '@/types/ads'
import { ROUTES } from '@/constants/brand'
import { cn } from '@/lib/utils'

/**
 * Global rewarded video player (mock).
 * Ready to swap internals for AdMob Rewarded / Google ads SDK.
 */
export function RewardedAdHost() {
  const pendingPlacement = useAdsStore((s) => s.pendingPlacement)
  const completeAd = useAdsStore((s) => s.completeAd)
  const cancelAd = useAdsStore((s) => s.cancelAd)

  const open = Boolean(pendingPlacement)

  return (
    <AnimatePresence>
      {open && pendingPlacement && (
        <RewardedAdPlayer
          key={pendingPlacement}
          placement={pendingPlacement}
          onComplete={() => {
            completeAd(pendingPlacement)
            toast.success('Recurso liberado. Obrigado por assistir!')
          }}
          onClose={cancelAd}
        />
      )}
    </AnimatePresence>
  )
}

function RewardedAdPlayer({
  placement,
  onComplete,
  onClose,
}: {
  placement: keyof typeof AD_PLACEMENTS
  onComplete: () => void
  onClose: () => void
}) {
  const meta = AD_PLACEMENTS[placement]
  const creative = useMemo(() => adsService.getCreative(), [])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const duration = creative.durationSec

  useEffect(() => {
    let alive = true
    adsService.loadRewarded(placement).then(() => {
      if (alive) setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [placement])

  useEffect(() => {
    if (!playing || loading) return
    const start = Date.now()
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)
      if (elapsed >= duration * 0.7) setCanSkip(true)
      if (elapsed >= duration) {
        window.clearInterval(id)
        onComplete()
      }
    }, 80)
    return () => window.clearInterval(id)
  }, [playing, loading, duration, onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-3 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rewarded-ad-title"
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <p id="rewarded-ad-title" className="text-sm font-semibold text-foreground">
              {meta.title}
            </p>
            <p className="text-xs text-muted-foreground">{meta.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar anúncio"
          >
            <X className="size-4" />
          </button>
        </div>

        <div
          className={cn(
            'relative aspect-video overflow-hidden bg-gradient-to-br',
            creative.gradient,
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {creative.badge} · Anúncio
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
            <Volume2 className="size-3" aria-hidden />
            Vídeo
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            {loading ? (
              <p className="text-sm font-medium text-white/90">Carregando anúncio…</p>
            ) : !playing ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  {creative.advertiser}
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">{creative.title}</h3>
                <p className="mt-1 text-sm text-white/85">{creative.subtitle}</p>
                <Button
                  className="mt-5"
                  variant="secondary"
                  onClick={() => setPlaying(true)}
                  aria-label="Assistir anúncio"
                >
                  <Play className="size-4" />
                  Assistir {duration}s
                </Button>
              </>
            ) : (
              <>
                <Sparkles className="mb-2 size-8 animate-pulse text-white/90" aria-hidden />
                <p className="text-sm font-semibold">{creative.advertiser}</p>
                <p className="mt-1 text-lg font-bold">{creative.title}</p>
                <p className="mt-4 text-xs text-white/80">
                  {Math.max(0, Math.ceil(duration - (progress / 100) * duration))}s restantes
                </p>
              </>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/30">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-center text-xs text-muted-foreground">
            Plano gratuito inclui anúncios. Remova tudo com Premium.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Agora não
            </Button>
            {canSkip ? (
              <Button className="flex-1" onClick={onComplete}>
                Continuar
              </Button>
            ) : (
              <Button className="flex-1" variant="soft" asChild>
                <Link href={ROUTES.planos}>
                  <Crown className="size-4" />
                  Ir Premium
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

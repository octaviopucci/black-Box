import { useEffect, useState } from 'react'
import { asset, site } from '../../data/site'
import { useMotion } from '../../hooks/useMotion'

export function Preloader() {
  const { reduced } = useMotion()
  const [visible, setVisible] = useState(!reduced)

  useEffect(() => {
    if (reduced) return
    const done = window.setTimeout(() => setVisible(false), 1400)
    return () => window.clearTimeout(done)
  }, [reduced])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-surface">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-gold/25" />
        <span className="absolute inset-2 animate-preloader-spin rounded-full border-2 border-transparent border-t-gold" />
        <img
          src={asset('logo-256.png')}
          alt=""
          className="h-20 w-20 rounded-full object-cover ring-1 ring-gold/30"
        />
      </div>
      <p className="absolute mt-48 font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
        {site.name}
      </p>
    </div>
  )
}

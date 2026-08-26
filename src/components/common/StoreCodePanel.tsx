import { useState } from 'react'
import { Copy, Check, KeyRound } from 'lucide-react'
import { cn } from '@/utils'

type StoreCodePanelProps = {
  slug: string
  className?: string
  title?: string
  hint?: string
}

export function StoreCodePanel({
  slug,
  className,
  title = 'Código da loja',
  hint = 'Use no login em outro celular, PC ou aba anônima (campo “Código da loja”).',
}: StoreCodePanelProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(slug)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn('border border-lp-accent/35 bg-lp-accent/10 px-4 py-4', className)}
      style={{ borderRadius: 'var(--lp-radius-lg)' }}
    >
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-lp-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-accent">{title}</p>
          <p className="mt-2 font-mono text-lg font-bold tracking-wide text-lp-ink">{slug}</p>
          <p className="mt-2 text-sm text-lp-steel">{hint}</p>
          <button type="button" className="btn-secondary mt-3 gap-2" onClick={() => void copy()}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar código'}
          </button>
        </div>
      </div>
    </div>
  )
}

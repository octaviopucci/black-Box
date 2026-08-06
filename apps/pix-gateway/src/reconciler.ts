import type { Db } from './db/index.js'
import { listCharges, syncChargeFromProvider } from './services/charges.js'

/**
 * Fallback automático: se o webhook atrasar/falhar, reconsulta cobranças pending no PSP.
 */
export function startReconciler(
  db: Db,
  options: { intervalMs?: number; log?: (msg: string) => void } = {},
): { stop: () => void } {
  const intervalMs = options.intervalMs ?? 30_000
  const log = options.log ?? (() => undefined)

  const timer = setInterval(() => {
    void (async () => {
      const pending = listCharges(db, 100).filter((c) => c.status === 'pending')
      for (const charge of pending) {
        try {
          const updated = await syncChargeFromProvider(db, charge.id)
          if (updated.status !== 'pending') {
            log(`reconcile ${charge.id} -> ${updated.status}`)
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          log(`reconcile failed ${charge.id}: ${message}`)
        }
      }
    })()
  }, intervalMs)

  timer.unref?.()

  return {
    stop: () => clearInterval(timer),
  }
}

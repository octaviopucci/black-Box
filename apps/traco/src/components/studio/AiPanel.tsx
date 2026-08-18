import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useStudio } from '@/store/StudioContext'

const SUGGESTIONS = [
  'Deixe mais quente e luminoso',
  'Converta para esboço a lápis',
  'Aplique glow neon suave',
  'Remova o conteúdo da seleção',
  'Deixe em preto e branco dramático',
  'Recolorir com tons jade',
  'Desfoque o fundo da seleção',
  'Aumente saturação e nitidez',
]

export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const studio = useStudio()
  const [prompt, setPrompt] = useState('')

  const submit = async () => {
    if (!prompt.trim() || studio.aiBusy) return
    if (!studio.selection.active) {
      studio.selectActiveLayer()
    }
    await studio.runAi(prompt.trim())
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="absolute bottom-20 left-1/2 z-30 w-[min(520px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-panel/95 shadow-soft backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember/15 text-ember">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-bone">IA no traço</p>
                <p className="text-[11px] text-mist">
                  {studio.selection.active
                    ? `Alvo: ${studio.selection.kind === 'layer' ? 'camada inteira' : 'seleção'}`
                    : 'Sem seleção — usará a camada ativa'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-mist hover:bg-slate hover:text-bone"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex.: transforme em aquarela azul, remova o objeto, adicione brilho…"
              rows={3}
              className="w-full resize-none rounded-xl border border-line bg-ink px-3 py-2 text-sm text-bone outline-none ring-ember/40 placeholder:text-mist/70 focus:ring-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submit()
              }}
            />

            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-line bg-slate px-2.5 py-1 text-[11px] text-mist hover:border-ember/40 hover:text-bone"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-mist">
                {studio.aiMessage || 'Demo IA local sempre disponível; API real se houver chave.'}
              </p>
              <button
                disabled={studio.aiBusy || !prompt.trim()}
                onClick={() => void submit()}
                className="shrink-0 rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-ink transition hover:bg-emberSoft disabled:opacity-40"
              >
                {studio.aiBusy ? 'Gerando…' : 'Aplicar IA'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

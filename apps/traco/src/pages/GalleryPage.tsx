import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { createCanvas, canvasToDataUrl } from '@/lib/canvasOps'
import { uid } from '@/lib/id'
import { deleteDocument, listDocuments, saveDocument } from '@/lib/storage'
import { createBlankDocMeta } from '@/store/StudioContext'

export function GalleryPage() {
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)
  const docs = useMemo(() => listDocuments(), [tick])

  const createDoc = (w = 1280, h = 720) => {
    const meta = createBlankDocMeta()
    meta.width = w
    meta.height = h
    meta.name = `Tela ${docs.length + 1}`
    const layerId = uid('layer')
    const canvas = createCanvas(w, h)
    const blank = canvasToDataUrl(canvas)
    const preview = createCanvas(w, h)
    const ctx = preview.getContext('2d')!
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
    meta.thumbnail = canvasToDataUrl(preview)
    saveDocument({
      meta,
      layers: [
        {
          id: layerId,
          name: 'Camada 1',
          visible: true,
          opacity: 1,
          blendMode: 'source-over',
          locked: false,
          image: blank,
        },
      ],
      activeLayerId: layerId,
      background: '#FFFFFF',
    })
    navigate(`/studio/${meta.id}`)
  }

  return (
    <div className="min-h-screen bg-atmosphere">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl font-bold text-bone">
          traço
        </Link>
        <button
          onClick={() => createDoc()}
          className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-ink hover:bg-emberSoft"
        >
          <Plus size={16} />
          Nova tela
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="font-display text-4xl font-semibold text-bone">Gallery</h1>
        <p className="mt-2 max-w-xl text-mist">
          Seus documentos ficam neste navegador. Abra uma tela e use laço + IA para editar regiões.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: 'Landscape 1280×720', w: 1280, h: 720 },
            { label: 'Square 1080', w: 1080, h: 1080 },
            { label: 'Portrait 1080×1920', w: 1080, h: 1920 },
            { label: 'A4 ~ 1240×1754', w: 1240, h: 1754 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => createDoc(s.w, s.h)}
              className="rounded-full border border-line bg-panel/70 px-3 py-1.5 text-xs text-mist hover:text-bone"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.length === 0 && (
            <button
              onClick={() => createDoc()}
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-panel/40 text-mist hover:border-ember/40 hover:text-bone"
            >
              <Plus className="mb-2" />
              Criar primeiro documento
            </button>
          )}
          {docs.map((doc) => (
            <article
              key={doc.id}
              className="group overflow-hidden rounded-2xl border border-line bg-panel/60"
            >
              <Link to={`/studio/${doc.id}`} className="block">
                <div className="aspect-[4/3] bg-ink">
                  {doc.thumbnail ? (
                    <img
                      src={doc.thumbnail}
                      alt={doc.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-mist">Sem preview</div>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div className="min-w-0">
                  <Link
                    to={`/studio/${doc.id}`}
                    className="block truncate text-sm font-medium text-bone hover:text-emberSoft"
                  >
                    {doc.name}
                  </Link>
                  <p className="text-[11px] text-mist">
                    {doc.width}×{doc.height} ·{' '}
                    {new Date(doc.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  title="Excluir"
                  onClick={() => {
                    deleteDocument(doc.id)
                    setTick((t) => t + 1)
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg text-mist hover:bg-ink hover:text-ember"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

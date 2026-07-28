import { ImagePlus, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { compressImageFile } from '@/utils/images'

interface PhotoGalleryProps {
  photos: string[]
  mainIndex: number
  onChange: (photos: string[], mainIndex: number) => void
  max?: number
  editable?: boolean
}

export function PhotoGallery({
  photos,
  mainIndex,
  onChange,
  max = 15,
  editable = true,
}: PhotoGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const remaining = max - photos.length
    if (remaining <= 0) return

    const selected = Array.from(files).slice(0, remaining)
    setBusy(true)
    setError('')
    try {
      const urls: string[] = []
      for (const file of selected) {
        urls.push(await compressImageFile(file))
      }
      onChange([...photos, ...urls], photos.length ? mainIndex : 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao processar fotos')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (index: number) => {
    const next = photos.filter((_, i) => i !== index)
    let nextMain = mainIndex
    if (index === mainIndex) nextMain = 0
    else if (index < mainIndex) nextMain = Math.max(0, mainIndex - 1)
    onChange(next, next.length ? Math.min(nextMain, next.length - 1) : 0)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/60">
          {photos.length}/{max} fotos · imagens são comprimidas automaticamente · clique na estrela
          para a principal
        </p>
        {editable ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={photos.length >= max || busy}
              loading={busy}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              {busy ? 'Processando…' : 'Upload'}
            </Button>
          </>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {photos.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((src, i) => (
            <div
              key={`${i}-${src.slice(0, 24)}-${src.length}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                i === mainIndex ? 'border-brand-red shadow-glow' : 'border-brand-gray/50'
              }`}
            >
              <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {editable ? (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/80 to-transparent p-2">
                  <button
                    type="button"
                    className="rounded-lg bg-black/40 p-1.5 text-white hover:text-amber-300"
                    onClick={() => onChange(photos, i)}
                    title="Definir principal"
                  >
                    <Star
                      className={`h-4 w-4 ${i === mainIndex ? 'fill-amber-300 text-amber-300' : ''}`}
                    />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-black/40 p-1.5 text-white hover:text-red-400"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-[21/9] items-center justify-center rounded-xl border border-dashed border-brand-gray/60 bg-brand-black/40 text-sm text-white/40">
          Nenhuma foto adicionada
        </div>
      )}
    </div>
  )
}

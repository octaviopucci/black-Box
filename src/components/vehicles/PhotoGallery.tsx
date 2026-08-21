import { Camera, ImagePlus, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { compressImageFile } from '@/utils/images'

interface PhotoGalleryProps {
  photos: string[]
  mainIndex: number
  onChange?: (photos: string[], mainIndex: number) => void
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
  const cameraRef = useRef<HTMLInputElement>(null)
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
      onChange?.([...photos, ...urls], photos.length ? mainIndex : 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao processar fotos')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
      if (cameraRef.current) cameraRef.current.value = ''
    }
  }

  const remove = (index: number) => {
    const next = photos.filter((_, i) => i !== index)
    let nextMain = mainIndex
    if (index === mainIndex) nextMain = 0
    else if (index < mainIndex) nextMain = Math.max(0, mainIndex - 1)
    onChange?.(next, next.length ? Math.min(nextMain, next.length - 1) : 0)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-lp-steel">
          {photos.length}/{max} fotos · comprimidas automaticamente · estrela = principal
        </p>
        {editable ? (
          <div className="flex gap-2">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
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
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              Câmera
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={photos.length >= max || busy}
              loading={busy}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              Galeria
            </Button>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-lp-danger">{error}</p> : null}

      {photos.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((src, i) => (
            <div
              key={`${i}-${src.slice(0, 24)}-${src.length}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                i === mainIndex ? 'border-lp-accent shadow-panel ring-2 ring-lp-accent/20' : 'border-lp-line'
              }`}
            >
              <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {editable ? (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-lp-ink/70 to-transparent p-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/20 p-1.5 text-white hover:text-lp-copper"
                    onClick={() => onChange?.(photos, i)}
                    title="Definir principal"
                  >
                    <Star
                      className={`h-4 w-4 ${i === mainIndex ? 'fill-lp-copper text-lp-copper' : ''}`}
                    />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-white/20 p-1.5 text-white hover:text-red-300"
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
        <div className="flex aspect-[21/9] items-center justify-center rounded-xl border border-dashed border-lp-line bg-lp-mist/50 text-sm text-lp-steel">
          Nenhuma foto adicionada
        </div>
      )}
    </div>
  )
}

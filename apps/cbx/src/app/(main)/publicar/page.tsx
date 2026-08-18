'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  MapPin,
  PartyPopper,
  Sparkles,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PriceTag } from '@/components/ui/price-tag'
import { ROUTES } from '@/constants/brand'
import { categoryService } from '@/services'
import { usePublishStore } from '@/stores/app-store'
import { liveCatalog } from '@/lib/live-catalog'
import { getSellerPlan } from '@/lib/plans'
import { cn, formatCurrency } from '@/lib/utils'

const STEP_LABELS = [
  'Fotos',
  'Categoria',
  'Título',
  'Descrição',
  'Preço',
  'Condição',
  'Localização',
  'Pré-visualização',
  'Confirmar',
  'Concluído',
]

const NEIGHBORHOODS = ['Centro', 'Jardim Europa', 'Vila Nova', 'São João', 'Bairro Alto']

const CONDITIONS = [
  { value: 'novo' as const, label: 'Novo', desc: 'Nunca usado, com etiqueta ou na caixa' },
  { value: 'seminovo' as const, label: 'Seminovo', desc: 'Pouco uso, em ótimo estado' },
  { value: 'usado' as const, label: 'Usado', desc: 'Sinais normais de uso' },
]

export default function PublicarPage() {
  const draft = usePublishStore()
  const categories = categoryService.list()
  const progress = Math.round((draft.step / (STEP_LABELS.length - 1)) * 100)
  const router = useRouter()
  const useApi = process.env.NEXT_PUBLIC_USE_API === '1'
  const [gate, setGate] = useState<{
    canPublish: boolean
    reason: string
    activeAds: number
    adsLimit: number
    plan?: string
  } | null>(useApi ? null : { canPublish: true, reason: 'ok', activeAds: 0, adsLimit: -1 })

  useEffect(() => {
    if (!useApi) return
    let cancelled = false
    liveCatalog
      .billingMe()
      .then((data) => {
        if (!cancelled) {
          setGate({
            canPublish: data.gate.canPublish,
            reason: data.gate.reason,
            activeAds: data.gate.activeAds,
            adsLimit: data.gate.adsLimit,
            plan: data.user.plan,
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGate({ canPublish: false, reason: 'subscription', activeAds: 0, adsLimit: 0 })
        }
      })
    return () => {
      cancelled = true
    }
  }, [useApi])

  const addPhoto = useCallback(() => {
    if (draft.images.length >= 8) {
      toast.info('Máximo de 8 fotos por anúncio')
      return
    }
    const seed = `pub-${Date.now()}-${draft.images.length}`
    draft.setField('images', [
      ...draft.images,
      `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&sig=${seed}`,
    ])
  }, [draft])

  if (gate && !gate.canPublish) {
    const limitHit = gate.reason === 'limit'
    return (
      <PageShell>
        <Container className="py-10">
          <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
              <Lock className="size-6" aria-hidden />
            </div>
            <h1 className="mt-4 text-xl font-bold tracking-tight">
              {limitHit ? 'Limite de anúncios atingido' : 'Mensalidade necessária'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {limitHit
                ? `Seu plano permite ${gate.adsLimit} anúncios ativos. Pause ou venda um anúncio, ou faça upgrade.`
                : 'Para publicar no CBX, escolha um plano e pague a mensalidade via Pix.'}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => router.push(limitHit ? ROUTES.meusAnuncios : ROUTES.planos)}>
                {limitHit ? 'Ver meus anúncios' : 'Ver planos e pagar Pix'}
              </Button>
            </div>
          </div>
        </Container>
      </PageShell>
    )
  }

  const removePhoto = (index: number) => {
    draft.setField(
      'images',
      draft.images.filter((_, i) => i !== index),
    )
  }

  const canProceed = (): boolean => {
    switch (draft.step) {
      case 0:
        return draft.images.length > 0
      case 1:
        return !!draft.categoryId
      case 2:
        return draft.title.trim().length >= 5
      case 3:
        return draft.description.trim().length >= 20
      case 4:
        return !!draft.price && Number(draft.price.replace(/\D/g, '')) > 0
      case 5:
        return !!draft.condition
      case 6:
        return !!draft.neighborhood
      case 7:
      case 8:
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!canProceed()) {
      toast.error('Preencha os campos obrigatórios antes de continuar')
      return
    }
    if (draft.step === 8) {
      const useApi = process.env.NEXT_PUBLIC_USE_API === '1'
      if (useApi) {
        try {
          const priceValue = Number(draft.price.replace(/\D/g, '')) / 100
          await liveCatalog.publish({
            title: draft.title.trim(),
            description: draft.description.trim(),
            price: priceValue,
            condition: draft.condition || 'usado',
            categoryId: draft.categoryId,
            images: draft.images,
            neighborhood: draft.neighborhood,
          })
          draft.nextStep()
          toast.success('Anúncio publicado e visível para todos!')
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Erro ao publicar. Faça login e tente de novo.'
          toast.error(message)
          if (message.includes('Assine') || message.includes('Limite')) {
            router.push(message.includes('Limite') ? ROUTES.meusAnuncios : ROUTES.planos)
          }
        }
        return
      }
      draft.nextStep()
      toast.success('Anúncio publicado com sucesso! (demo local)')
      return
    }
    draft.nextStep()
  }

  const selectedCategory = categories.find((c) => c.id === draft.categoryId)
  const selectedPlan = getSellerPlan(gate?.plan || draft.plan)
  const priceValue = Number(draft.price.replace(/\D/g, '')) / 100

  return (
    <PageShell className="pb-24">
      <Container className="py-6">
        {draft.step < 9 && (
          <>
            <SectionHeader
              title="Publicar anúncio"
              subtitle={`Passo ${draft.step + 1} de ${STEP_LABELS.length - 1} — ${STEP_LABELS[draft.step]}`}
            />
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>{STEP_LABELS[draft.step]}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={draft.step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {draft.step === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adicione até 8 fotos do seu produto. A primeira será a capa do anúncio.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {draft.images.map((url, i) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted">
                      <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="200px" />
                      {i === 0 && (
                        <Badge className="absolute left-2 top-2" variant="primary">
                          Capa
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
                        aria-label="Remover foto"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                  {draft.images.length < 8 && (
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Camera className="size-8" />
                      <span className="text-xs font-medium">Adicionar foto</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {draft.step === 1 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => draft.setField('categoryId', cat.id)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-colors',
                      draft.categoryId === cat.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border/60 bg-card hover:border-primary/40',
                    )}
                  >
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cat.productCount} anúncios
                    </p>
                  </button>
                ))}
              </div>
            )}

            {draft.step === 2 && (
              <Input
                label="Título do anúncio"
                placeholder="Ex: iPhone 14 Pro 256GB em ótimo estado"
                value={draft.title}
                onChange={(e) => draft.setField('title', e.target.value)}
                maxLength={80}
              />
            )}

            {draft.step === 3 && (
              <Textarea
                label="Descrição"
                placeholder="Descreva o produto, estado de conservação, o que acompanha..."
                value={draft.description}
                onChange={(e) => draft.setField('description', e.target.value)}
                rows={6}
              />
            )}

            {draft.step === 4 && (
              <div className="space-y-4">
                <Input
                  label="Preço"
                  placeholder="R$ 0,00"
                  value={draft.price}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '')
                    const cents = Number(digits)
                    draft.setField(
                      'price',
                      cents > 0
                        ? (cents / 100).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : '',
                    )
                  }}
                />
                {priceValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Valor informado: <strong>{formatCurrency(priceValue)}</strong>
                  </p>
                )}
              </div>
            )}

            {draft.step === 5 && (
              <div className="space-y-3">
                {CONDITIONS.map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => draft.setField('condition', cond.value)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                      draft.condition === cond.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border/60 bg-card hover:border-primary/40',
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                        draft.condition === cond.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/40',
                      )}
                    >
                      {draft.condition === cond.value && <Check className="size-3" />}
                    </div>
                    <div>
                      <p className="font-medium">{cond.label}</p>
                      <p className="text-sm text-muted-foreground">{cond.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {draft.step === 6 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Selecione o bairro em Capão Bonito onde o produto está disponível.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {NEIGHBORHOODS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => draft.setField('neighborhood', n)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                        draft.neighborhood === n
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border/60 hover:border-primary/40',
                      )}
                    >
                      <MapPin className="size-4 shrink-0" />
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {draft.step === 7 && (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                {draft.images[0] && (
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={draft.images[0]}
                      alt={draft.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                )}
                <div className="space-y-3 p-4">
                  <h3 className="text-lg font-bold">{draft.title || 'Sem título'}</h3>
                  <PriceTag price={priceValue} size="lg" />
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && <Badge variant="neutral">{selectedCategory.name}</Badge>}
                    {draft.condition && (
                      <Badge variant="secondary">
                        {CONDITIONS.find((c) => c.value === draft.condition)?.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{draft.description}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {draft.neighborhood}, Capão Bonito
                  </p>
                </div>
              </div>
            )}

            {draft.step === 8 && (
              <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-semibold">Confirmar publicação</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan
                    ? `Plano ${selectedPlan.name} · ${
                        selectedPlan.adsLimit == null
                          ? 'anúncios ilimitados'
                          : `${gate?.activeAds ?? 0}/${selectedPlan.adsLimit} anúncios ativos`
                      }.`
                    : 'Sua mensalidade Pix precisa estar ativa para este anúncio ir ao ar.'}
                </p>
                <p className="text-sm">
                  Título: <strong>{draft.title}</strong>
                </p>
                <PriceTag price={priceValue} size="md" />
              </div>
            )}

            {draft.step === 9 && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-success/10">
                  <PartyPopper className="size-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold">Anúncio publicado!</h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Seu anúncio &ldquo;{draft.title}&rdquo; está no ar com o plano{' '}
                  <strong>{selectedPlan?.name}</strong>. Compradores de Capão Bonito já podem
                  visualizá-lo.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href={ROUTES.meusAnuncios}>Ver meus anúncios</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      draft.reset()
                    }}
                  >
                    <Sparkles className="mr-2 size-4" />
                    Publicar outro
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>

      {draft.step < 9 && (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border/60 bg-background/95 backdrop-blur-sm md:bottom-0">
          <Container className="flex items-center justify-between gap-3 py-3">
            <Button
              variant="outline"
              onClick={() => draft.prevStep()}
              disabled={draft.step === 0}
            >
              <ChevronLeft className="mr-1 size-4" />
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {draft.step === 8 ? 'Publicar' : 'Próximo'}
              {draft.step < 8 && <ChevronRight className="ml-1 size-4" />}
            </Button>
          </Container>
        </div>
      )}
    </PageShell>
  )
}

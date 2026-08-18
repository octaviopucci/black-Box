'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { liveCatalog, type PixPayment } from '@/lib/live-catalog'
import { getSellerPlan } from '@/lib/plans'
import { formatCurrency } from '@/lib/utils'

function PagarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment')
  const planId = searchParams.get('plan')
  const [payment, setPayment] = useState<PixPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        if (paymentId) {
          const data = await liveCatalog.getPayment(paymentId)
          if (!cancelled) setPayment(data.payment)
          return
        }
        if (planId) {
          const data = await liveCatalog.createPix(planId)
          if (!cancelled) {
            setPayment(data.payment)
            router.replace(`/planos/pagar?payment=${data.payment.id}`)
          }
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : 'Erro ao carregar Pix')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [paymentId, planId, router])

  useEffect(() => {
    if (!payment || payment.status === 'paid') return
    const timer = setInterval(async () => {
      try {
        const data = await liveCatalog.getPayment(payment.id)
        setPayment(data.payment)
        if (data.payment.status === 'paid') {
          toast.success('Pix confirmado! Plano ativo por 30 dias.')
        }
      } catch {
        /* ignore polling errors */
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [payment])

  const copyPix = async () => {
    if (!payment?.pixCopyPaste) return
    await navigator.clipboard.writeText(payment.pixCopyPaste)
    toast.success('Código Pix copiado')
  }

  const sandboxPay = async () => {
    if (!payment) return
    setConfirming(true)
    try {
      const data = await liveCatalog.sandboxConfirm(payment.id)
      setPayment(data.payment)
      toast.success('Pagamento sandbox confirmado.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Não foi possível confirmar')
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Nenhum Pix encontrado.</p>
        <Button className="mt-4" onClick={() => router.push(ROUTES.planos)}>
          Voltar aos planos
        </Button>
      </div>
    )
  }

  const plan = getSellerPlan(payment.plan)
  const paid = payment.status === 'paid'

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
        {paid ? (
          <>
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-7" />
            </div>
            <h2 className="text-xl font-bold">Mensalidade ativa</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Plano {plan?.name || payment.plan} liberado
              {payment.periodEnd
                ? ` até ${new Date(payment.periodEnd).toLocaleDateString('pt-BR')}`
                : ''}
              .
            </p>
            <Button className="mt-6 w-full" onClick={() => router.push(ROUTES.publicar)}>
              Publicar anúncio
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Pague com Pix</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan?.name} · {formatCurrency(payment.amount)} · 30 dias
            </p>
            {payment.pixQrImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={payment.pixQrImage}
                alt="QR Code Pix"
                className="mx-auto mt-6 size-56 rounded-xl border border-border/60 bg-white p-2"
              />
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Abra o app do banco, escaneie o QR ou cole o código.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={copyPix}>
              <Copy className="size-4" />
              Copiar código Pix
            </Button>
            {payment.sandbox && (
              <Button
                className="mt-3 w-full"
                variant="secondary"
                loading={confirming}
                onClick={sandboxPay}
              >
                Já paguei (demo)
              </Button>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Esta tela atualiza sozinha quando o pagamento for confirmado.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function PagarPlanoPage() {
  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title="Mensalidade Pix" subtitle="Assinatura de vendedor CBX" />
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          }
        >
          <PagarContent />
        </Suspense>
      </Container>
    </PageShell>
  )
}

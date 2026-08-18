import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiPayment } from '@/lib/mappers'
import { fetchMercadoPagoPayment } from '@/lib/pix'
import { activatePlan } from '@/lib/subscription'
import { isSellerPlanId } from '@/lib/plans'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params
  const payment = await prisma.payment.findUnique({ where: { id } })
  if (!payment || payment.userId !== session.user.id) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
  }

  if (
    payment.status === 'pending' &&
    payment.provider === 'mercadopago' &&
    payment.providerPaymentId
  ) {
    const remote = await fetchMercadoPagoPayment(payment.providerPaymentId)
    if (remote?.status === 'approved' && isSellerPlanId(payment.plan)) {
      const updated = await prisma.$transaction(async (tx) => {
        const paid = await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'paid', paidAt: new Date() },
        })
        return paid
      })
      const user = await activatePlan(payment.userId, payment.plan)
      await prisma.payment.update({
        where: { id: updated.id },
        data: { periodStart: new Date(), periodEnd: user.planExpiresAt },
      })
      const fresh = await prisma.payment.findUnique({ where: { id } })
      return NextResponse.json({ payment: toApiPayment(fresh!) })
    }
  }

  return NextResponse.json({ payment: toApiPayment(payment) })
}

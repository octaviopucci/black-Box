import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/prisma'
import { fetchMercadoPagoPayment } from '@/lib/pix'
import { activatePlan } from '@/lib/subscription'
import { isSellerPlanId } from '@/lib/plans'

/**
 * Mercado Pago webhook. Configure the URL:
 *   https://SEU-DOMINIO/api/billing/webhook
 */
export async function POST(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  let body: { type?: string; action?: string; data?: { id?: string } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  const remoteId = body.data?.id
  if (!remoteId || (body.type !== 'payment' && body.action !== 'payment.updated')) {
    return NextResponse.json({ ok: true })
  }

  const remote = await fetchMercadoPagoPayment(remoteId)
  if (!remote || remote.status !== 'approved') {
    return NextResponse.json({ ok: true })
  }

  const payment = await prisma.payment.findFirst({
    where: { providerPaymentId: String(remote.id) },
  })
  if (!payment || payment.status === 'paid') {
    return NextResponse.json({ ok: true })
  }
  if (!isSellerPlanId(payment.plan)) {
    return NextResponse.json({ ok: true })
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'paid', paidAt: new Date() },
  })
  const user = await activatePlan(payment.userId, payment.plan)
  await prisma.payment.update({
    where: { id: payment.id },
    data: { periodStart: new Date(), periodEnd: user.planExpiresAt },
  })

  return NextResponse.json({ ok: true })
}

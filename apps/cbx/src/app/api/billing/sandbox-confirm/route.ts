import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma, hasDatabase } from '@/lib/prisma'
import { hasMercadoPago } from '@/lib/pix'
import { activatePlan } from '@/lib/subscription'
import { isSellerPlanId } from '@/lib/plans'
import { toApiPayment } from '@/lib/mappers'

const bodySchema = z.object({
  paymentId: z.string(),
})

/** Demo only — confirms Pix when Mercado Pago is not configured. */
export async function POST(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  if (hasMercadoPago() && process.env.CBX_ALLOW_SANDBOX_PIX !== '1') {
    return NextResponse.json({ error: 'Sandbox Pix desligado' }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const payment = await prisma.payment.findUnique({ where: { id: parsed.data.paymentId } })
  if (!payment || payment.userId !== session.user.id) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
  }
  if (payment.provider !== 'sandbox') {
    return NextResponse.json({ error: 'Este Pix não é sandbox' }, { status: 400 })
  }
  if (!isSellerPlanId(payment.plan)) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'paid', paidAt: new Date() },
  })
  const user = await activatePlan(payment.userId, payment.plan)
  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { periodStart: new Date(), periodEnd: user.planExpiresAt },
  })

  return NextResponse.json({ payment: toApiPayment(updated) })
}

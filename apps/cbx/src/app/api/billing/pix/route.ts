import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma, hasDatabase } from '@/lib/prisma'
import { createPixCharge } from '@/lib/pix'
import { getSellerPlan, isSellerPlanId } from '@/lib/plans'
import { toApiPayment } from '@/lib/mappers'

const bodySchema = z.object({
  planId: z.string(),
})

export async function POST(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para assinar' }, { status: 401 })
  }

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success || !isSellerPlanId(parsed.data.planId)) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const plan = getSellerPlan(parsed.data.planId)!
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  try {
    const charge = await createPixCharge({
      plan: plan.id,
      email: user.email,
      name: user.name,
    })

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        plan: plan.id,
        amount: charge.amount,
        status: 'pending',
        pixCopyPaste: charge.pixCopyPaste,
        pixQrBase64: charge.pixQrBase64,
        pixExpiresAt: charge.pixExpiresAt,
        provider: charge.provider,
        providerPaymentId: charge.providerPaymentId,
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: user.subscriptionStatus === 'active' ? 'active' : 'pending' },
    })

    return NextResponse.json({ payment: toApiPayment(payment) }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao gerar Pix' },
      { status: 500 },
    )
  }
}

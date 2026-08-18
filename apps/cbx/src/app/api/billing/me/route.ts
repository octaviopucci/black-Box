import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma, hasDatabase } from '@/lib/prisma'
import { getPublishGate } from '@/lib/subscription'
import { SELLER_PLANS } from '@/lib/plans'
import { toApiUser } from '@/lib/mappers'

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const gate = await getPublishGate(user.id)
  return NextResponse.json({
    user: toApiUser(user, { activeAds: gate.activeAds }),
    gate,
    plans: SELLER_PLANS,
  })
}

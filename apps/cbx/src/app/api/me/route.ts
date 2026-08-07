import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiProduct, toApiUser } from '@/lib/mappers'

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

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    user: toApiUser(user),
    products: products.map(toApiProduct),
  })
}

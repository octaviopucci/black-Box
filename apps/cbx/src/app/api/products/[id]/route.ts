import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiProduct } from '@/lib/mappers'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
  }

  await prisma.product.update({
    where: { id },
    data: { views: { increment: 1 } },
  })

  return NextResponse.json({ product: toApiProduct({ ...product, views: product.views + 1 }) })
}

export async function PATCH(req: Request, { params }: Params) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
  }
  if (existing.sellerId !== session.user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json()
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.title ? { title: body.title } : {}),
      ...(body.description ? { description: body.description } : {}),
      ...(typeof body.price === 'number' ? { price: body.price } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.images ? { images: body.images } : {}),
      ...(body.neighborhood ? { neighborhood: body.neighborhood } : {}),
    },
  })

  return NextResponse.json({ product: toApiProduct(product) })
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
  }
  if (existing.sellerId !== session.user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  await prisma.product.update({
    where: { id },
    data: { status: 'pausado' },
  })

  return NextResponse.json({ ok: true })
}

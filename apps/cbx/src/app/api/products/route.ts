import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiProduct, makeProductSlug } from '@/lib/mappers'
import { auth } from '@/auth'
import { getPublishGate } from '@/lib/subscription'
import { z } from 'zod'

export async function GET(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada', products: [] }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const categoryId = searchParams.get('categoryId')
  const sellerId = searchParams.get('sellerId')
  const status = searchParams.get('status') || 'ativo'
  const limit = Math.min(Number(searchParams.get('limit') || 50), 100)

  const products = await prisma.product.findMany({
    where: {
      status: status as 'ativo',
      ...(categoryId ? { categoryId } : {}),
      ...(sellerId ? { sellerId } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { tags: { has: q.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ products: products.map(toApiProduct) })
}

const createSchema = z.object({
  title: z.string().min(5).max(80),
  description: z.string().min(20).max(4000),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  condition: z.enum(['novo', 'seminovo', 'usado']),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(8),
  neighborhood: z.string().min(1),
  city: z.string().optional(),
  tags: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.string()).optional(),
})

export async function POST(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 503 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para publicar' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
    }

    const gate = await getPublishGate(session.user.id)
    if (!gate.canPublish) {
      if (gate.reason === 'limit') {
        return NextResponse.json(
          {
            error: `Limite de ${gate.adsLimit} anúncios ativos do seu plano. Pause ou venda um anúncio, ou faça upgrade.`,
            code: 'ADS_LIMIT',
            gate,
          },
          { status: 403 },
        )
      }
      return NextResponse.json(
        {
          error: 'Assine um plano e pague o Pix da mensalidade para publicar.',
          code: 'SUBSCRIPTION_REQUIRED',
          gate,
        },
        { status: 402 },
      )
    }

    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        title: parsed.data.title,
        slug: makeProductSlug(parsed.data.title),
        description: parsed.data.description,
        price: parsed.data.price,
        oldPrice: parsed.data.oldPrice,
        condition: parsed.data.condition,
        categoryId: parsed.data.categoryId,
        sellerId: session.user.id,
        images: parsed.data.images,
        neighborhood: parsed.data.neighborhood,
        city: parsed.data.city || 'Capão Bonito',
        tags: parsed.data.tags || [],
        specs: parsed.data.specs || {},
        status: 'ativo',
      },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { adsCount: { increment: 1 } },
    })
    await prisma.category.update({
      where: { id: category.id },
      data: { productCount: { increment: 1 } },
    })

    return NextResponse.json({ product: toApiProduct(product) }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao publicar anúncio' }, { status: 500 })
  }
}

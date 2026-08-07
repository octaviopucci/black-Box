import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiCategory } from '@/lib/mappers'

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada', categories: [] }, { status: 503 })
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ categories: categories.map(toApiCategory) })
}

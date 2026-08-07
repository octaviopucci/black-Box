import { NextResponse } from 'next/server'
import { hasDatabase } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'cbx-api',
    database: hasDatabase(),
    mode: process.env.NEXT_PUBLIC_USE_API === '1' ? 'api' : 'static',
  })
}

import { NextResponse } from 'next/server'
import { SELLER_PLANS } from '@/lib/plans'

export async function GET() {
  return NextResponse.json({ plans: SELLER_PLANS })
}

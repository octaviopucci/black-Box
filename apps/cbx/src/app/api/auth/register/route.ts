import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma, hasDatabase } from '@/lib/prisma'
import { toApiUser } from '@/lib/mappers'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
  password: z.string().min(6),
  city: z.string().optional(),
})

export async function POST(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: 'Banco não configurado. Defina DATABASE_URL (Neon).' },
      { status: 503 },
    )
  }

  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10)
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone || '',
        city: parsed.data.city || 'Capão Bonito',
        passwordHash,
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(email)}&backgroundColor=ede9fe`,
        plan: 'gratuito',
      },
    })

    return NextResponse.json({ user: toApiUser(user) }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao cadastrar' }, { status: 500 })
  }
}

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma, hasDatabase } from '@/lib/prisma'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDatabase() ? PrismaAdapter(prisma) : undefined,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!hasDatabase()) return null
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        })
        if (!user?.passwordHash) return null

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar || undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.plan = (user as { plan?: string }).plan
      }
      if (token.sub && hasDatabase()) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { plan: true, name: true, avatar: true },
        })
        if (dbUser) {
          token.plan = dbUser.plan
          token.name = dbUser.name
          token.picture = dbUser.avatar || undefined
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        ;(session.user as { plan?: string }).plan = (token.plan as string) || 'gratuito'
      }
      return session
    },
  },
  trustHost: true,
})

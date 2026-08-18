import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      plan?: string
      subscriptionStatus?: string
      adsLimit?: number
      planExpiresAt?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    plan?: string
    subscriptionStatus?: string
    adsLimit?: number
    planExpiresAt?: string
  }
}

import { z } from 'zod'

/** Prepared schemas for future form validation — not wired to backend. */
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export const publishAdSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(80),
  description: z.string().min(20, 'Descreva melhor o produto').max(2000),
  price: z.coerce.number().positive('Preço inválido'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  condition: z.enum(['novo', 'seminovo', 'usado']),
  neighborhood: z.string().min(1),
})

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  bio: z.string().max(300).optional(),
  city: z.string().min(2),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PublishAdInput = z.infer<typeof publishAdSchema>
export type ProfileInput = z.infer<typeof profileSchema>

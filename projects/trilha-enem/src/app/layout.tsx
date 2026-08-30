import type { Metadata } from 'next'
import { JetBrains_Mono, Source_Sans_3, Syne } from 'next/font/google'
import './globals.css'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Trilha ENEM — Questão corrigida. Redação com feedback.',
  description:
    'App de estudos para o ENEM: correção de questões, feedback de redação por competências e simulados com trilha personalizada.',
  openGraph: {
    title: 'Trilha ENEM',
    description: 'Estude com correção real. Nota que sobe.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${sourceSans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">{children}</body>
    </html>
  )
}

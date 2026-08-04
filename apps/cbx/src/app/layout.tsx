import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/providers/app-providers'
import { BRAND } from '@/constants/brand'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CBX — O Marketplace de Capão Bonito',
  description: BRAND.slogan,
  icons: {
    icon: '/brand/logo.png',
    apple: '/brand/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

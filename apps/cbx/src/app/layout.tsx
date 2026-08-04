import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/providers/app-providers'
import { BRAND } from '@/constants/brand'
import { assetPath } from '@/lib/asset-path'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const logoIcon = assetPath('/brand/logo.png')

export const metadata: Metadata = {
  title: 'CBX — O Marketplace de Capão Bonito',
  description: BRAND.slogan,
  icons: {
    icon: logoIcon,
    apple: logoIcon,
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

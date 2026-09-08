import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Black Box Platform',
  description: 'Revenue Operating System for commercial partners',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

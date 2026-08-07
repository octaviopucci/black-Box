import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

export function SiteShell({
  children,
  solidNav = false,
}: {
  children: ReactNode
  solidNav?: boolean
}) {
  return (
    <div className="min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-blue-deep"
      >
        Pular para o conteúdo
      </a>
      <Navbar solid={solidNav} />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

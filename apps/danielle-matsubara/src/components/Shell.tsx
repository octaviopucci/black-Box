import type { ReactNode } from 'react'
import { CustomCursor } from './CustomCursor'
import { PageProgress } from './PageProgress'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PulseWhatsApp } from './PulseWhatsApp'

type Props = {
  children: ReactNode
  darkNav?: boolean
}

export function Shell({ children }: Props) {
  return (
    <div className="min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-wine focus:px-4 focus:py-2 focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <CustomCursor />
      <PageProgress />
      <Navbar />
      <main id="conteudo">{children}</main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}

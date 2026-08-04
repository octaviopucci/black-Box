import Link from 'next/link'
import { WifiOff } from 'lucide-react'

import { Container, PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'

export default function OfflinePage() {
  return (
    <PageShell>
      <Container className="flex min-h-[60dvh] flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
          <WifiOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold">Você está offline</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Verifique sua conexão com a internet e tente novamente. Alguns recursos do CBX precisam de
          conexão para funcionar.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.home}>Tentar novamente</Link>
        </Button>
      </Container>
    </PageShell>
  )
}

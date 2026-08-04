import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Container, PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { ROUTES } from '@/constants/brand'

export default function ErroPage() {
  return (
    <PageShell>
      <Container className="py-6">
        <ErrorState
          icon={AlertTriangle}
          title="Ops! Algo deu errado"
          description="Encontramos um problema ao processar sua solicitação. Tente novamente em alguns instantes."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href={ROUTES.home}>Ir para o início</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={ROUTES.suporte}>Falar com suporte</Link>
              </Button>
            </div>
          }
        />
      </Container>
    </PageShell>
  )
}

import Link from 'next/link'
import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BRAND, ROUTES } from '@/constants/brand'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10">
        <SearchX className="size-10 text-primary" />
      </div>
      <p className="text-sm font-medium uppercase tracking-wider text-primary">{BRAND.name}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-lg font-medium text-foreground">Página não encontrada</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        A página que você procura não existe ou foi movida. Volte ao marketplace e continue
        explorando anúncios em {BRAND.city}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={ROUTES.home}>Página inicial</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.busca}>Buscar anúncios</Link>
        </Button>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { productService } from '@/services'
import { productAdStaticParams } from '@/lib/static-params'
import { EditAdForm } from './edit-form'

export function generateStaticParams() {
  return productAdStaticParams()
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarAnuncioPage({ params }: PageProps) {
  const { id } = await params
  const product = productService.get(id)

  if (!product) notFound()

  return (
    <PageShell>
      <Container className="py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={ROUTES.meusAnuncios}>
            <ChevronLeft className="mr-1 size-4" />
            Meus anúncios
          </Link>
        </Button>
        <SectionHeader title="Editar anúncio" subtitle={product.title} />
        <EditAdForm product={product} />
      </Container>
    </PageShell>
  )
}

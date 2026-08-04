import Link from 'next/link'
import { ChevronLeft, MapPin, Star } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/brand'
import { profileService } from '@/services'

export default function EnderecosPage() {
  const addresses = profileService.addresses()

  return (
    <PageShell>
      <Container className="py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={ROUTES.perfil}>
            <ChevronLeft className="mr-1 size-4" />
            Perfil
          </Link>
        </Button>
        <SectionHeader title="Endereços" subtitle="Gerencie seus endereços de entrega" />

        <div className="space-y-3">
          {addresses.map((addr) => (
            <article
              key={addr.id}
              className="rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <h3 className="font-semibold">{addr.label}</h3>
                  {addr.isDefault && (
                    <Badge variant="primary" className="text-[10px]">
                      <Star className="mr-0.5 size-3" />
                      Padrão
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {addr.street}, {addr.number} — {addr.neighborhood}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city}/{addr.state} — CEP {addr.zip}
              </p>
            </article>
          ))}
        </div>

        <Button variant="outline" className="mt-6" disabled>
          Adicionar endereço (em breve)
        </Button>
      </Container>
    </PageShell>
  )
}

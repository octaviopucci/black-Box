import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { BRAND } from '@/constants/brand'

export default function SobrePage() {
  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title={`Sobre o ${BRAND.name}`} subtitle={BRAND.slogan} />

        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="text-base leading-relaxed text-foreground">
            O <strong>{BRAND.name}</strong> é o marketplace local de {BRAND.city}, criado para conectar
            quem quer comprar e vender perto de casa. {BRAND.tagline}.
          </p>

          <h2 className="mt-8 text-lg font-bold text-foreground">Nossa missão</h2>
          <p>
            Facilitar o comércio local em {BRAND.city} e região, oferecendo uma plataforma segura,
            simples e acessível para pessoas físicas e empresas anunciarem seus produtos e serviços.
          </p>

          <h2 className="mt-6 text-lg font-bold text-foreground">O que oferecemos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Anúncios para vendedores com mensalidade via Pix</li>
            <li>Chat integrado entre compradores e vendedores</li>
            <li>Lojas virtuais para empresas da região</li>
            <li>Busca por categorias e localização</li>
            <li>Planos de destaque para maior visibilidade</li>
          </ul>

          <h2 className="mt-6 text-lg font-bold text-foreground">Contato</h2>
          <p>
            E-mail: {BRAND.email}
            <br />
            WhatsApp: (15) 99999-9999
            <br />
            {BRAND.city}, {BRAND.state} — Brasil
          </p>

          <p className="mt-8 text-xs">
            © {new Date().getFullYear()} {BRAND.name} Marketplace. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </PageShell>
  )
}

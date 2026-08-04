import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { BRAND } from '@/constants/brand'

export default function TermosPage() {
  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title="Termos de uso" subtitle={`Última atualização: agosto de 2026`} />

        <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
          <section>
            <h2 className="text-base font-bold text-foreground">1. Aceitação</h2>
            <p>
              Ao utilizar o {BRAND.name}, você concorda com estes termos. Se não concordar, não utilize
              a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">2. Natureza da plataforma</h2>
            <p>
              O {BRAND.name} é um marketplace de classificados que conecta compradores e vendedores em{' '}
              {BRAND.city}. Não somos parte das transações entre usuários e não garantimos a qualidade
              dos produtos anunciados.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">3. Responsabilidades do usuário</h2>
            <p>
              Você é responsável pela veracidade dos anúncios, pelo cumprimento das leis aplicáveis e
              pelas negociações realizadas com outros usuários. É proibido anunciar produtos ilegais,
              falsificados ou que violem direitos de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">4. Planos e pagamentos</h2>
            <p>
              Planos pagos são cobrados conforme descrito na página de planos. Cancelamentos seguem a
              política vigente no momento da contratação.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">5. Modificações</h2>
            <p>
              Podemos alterar estes termos a qualquer momento. Alterações significativas serão
              comunicadas por e-mail ou notificação na plataforma.
            </p>
          </section>
        </div>
      </Container>
    </PageShell>
  )
}

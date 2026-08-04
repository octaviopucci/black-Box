import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { BRAND } from '@/constants/brand'

export default function PrivacidadePage() {
  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title="Política de privacidade" subtitle={`Última atualização: agosto de 2026`} />

        <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
          <section>
            <h2 className="text-base font-bold text-foreground">1. Introdução</h2>
            <p>
              O {BRAND.name} respeita sua privacidade. Esta política descreve como coletamos, usamos e
              protegemos seus dados pessoais ao utilizar nossa plataforma de marketplace em{' '}
              {BRAND.city}.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">2. Dados coletados</h2>
            <p>Podemos coletar: nome, e-mail, telefone, endereço, fotos de perfil e anúncios, histórico de navegação e mensagens trocadas na plataforma.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">3. Uso dos dados</h2>
            <p>Utilizamos seus dados para operar o marketplace, facilitar transações entre usuários, enviar notificações relevantes e melhorar nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">4. Compartilhamento</h2>
            <p>Não vendemos seus dados. Compartilhamos informações apenas com outros usuários conforme necessário para transações (ex.: nome e telefone do vendedor) e com prestadores de serviço essenciais.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground">5. Seus direitos</h2>
            <p>Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato pelo e-mail {BRAND.email}, conforme a LGPD.</p>
          </section>
        </div>
      </Container>
    </PageShell>
  )
}

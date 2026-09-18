import Link from "next/link";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy-policy";
import { BRAND_NAME } from "@/lib/brand";

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-sm leading-relaxed text-ink">
      <p className="text-xs uppercase tracking-wider text-muted">Política de Privacidade · v{PRIVACY_POLICY_VERSION}</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">{BRAND_NAME}</h1>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">1. Quem somos</h2>
        <p>
          O {BRAND_NAME} é operado pela NA MESA como plataforma de pedidos por QR para restaurantes.
          O restaurante onde você está é o controlador operacional dos seus pedidos; a NA MESA processa
          dados técnicos para autenticação e operação do serviço.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">2. Dados que coletamos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Telefone (WhatsApp) e nome de exibição — verificação na mesa e identificação na comanda.</li>
          <li>Pedidos e consumo — operação do restaurante.</li>
          <li>Dados de cadastro do lojista (e-mail, nome, estabelecimento).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">3. Base legal e consentimento</h2>
        <p>
          Coletamos telefone e nome após consentimento explícito antes do envio do OTP ou cadastro.
          Você pode revogar participação saindo da mesa ou solicitando exclusão dos seus dados.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">4. Seus direitos (LGPD Art. 18)</h2>
        <p>
          Titulares podem solicitar acesso (portabilidade) ou exclusão via endpoints autenticados:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Cliente na mesa: <code className="text-xs">GET/POST /api/guest/dsr/*</code> (sessão guest)</li>
          <li>Lojista titular: <code className="text-xs">GET/POST /api/admin/dsr/*</code> (OWNER)</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">5. Retenção</h2>
        <p>
          Participações encerradas e dados de verificação são anonimizados ou removidos após 90 dias.
          Detalhes em <code className="text-xs">docs/PRIVACY-RETENTION.md</code>.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">6. Subprocessadores</h2>
        <p>Vercel (hosting), Vercel Blob/Redis (persistência), Evolution API/WhatsApp (OTP, quando configurado).</p>
      </section>

      <p className="mt-10 text-muted">
        <Link href="/" className="text-brand hover:underline">
          Voltar ao início
        </Link>
      </p>
    </main>
  );
}

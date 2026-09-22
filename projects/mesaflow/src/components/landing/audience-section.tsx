import { SectionShell } from "@/components/landing/section-shell";

export function AudienceSection() {
  return (
    <SectionShell id="para-quem" title="Pra quem faz sentido">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-brand/30 bg-brand/5 p-5">
          <h3 className="font-bold text-brand">Faz sentido</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Salão com pico de movimento</li>
            <li>Espera para pedir e mesa parada</li>
            <li>Pedido no bloco e retrabalho</li>
            <li>QR que só mostra cardápio</li>
            <li>Autonomia do cliente sem abrir mão do atendimento</li>
          </ul>
        </article>
        <article className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="font-bold text-muted">Não é o foco</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Delivery como operação principal</li>
            <li>Estoque industrial</li>
            <li>ERP total</li>
          </ul>
          <p className="mt-4 text-sm font-semibold text-ink">Foco: Fazer o salão funcionar melhor.</p>
        </article>
      </div>
    </SectionShell>
  );
}

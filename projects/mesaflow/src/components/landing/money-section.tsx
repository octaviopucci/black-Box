import { SectionShell } from "@/components/landing/section-shell";

export function MoneySection() {
  return (
    <SectionShell id="conta-dinheiro" title="Agora coloque isso em dinheiro">
      <div className="max-w-[38rem] space-y-4">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 font-mono text-sm">
          <p className="text-muted">10 mesas × 1 pedido adicional × R$12 × 26 dias</p>
          <p className="mt-2 text-xl font-extrabold text-brand">= R$ 3.120 potenciais no mês</p>
        </div>
        <p className="text-sm text-muted">
          Não é promessa de faturamento. É conta simples.
        </p>
        <p className="text-muted">
          Ganho também: menos tempo perdido, menos erro, resposta mais rápida, menos atrito no fechamento,
          rush melhor absorvido.
        </p>
      </div>
    </SectionShell>
  );
}

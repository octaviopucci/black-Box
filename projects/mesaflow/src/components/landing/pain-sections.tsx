import { SectionShell } from "@/components/landing/section-shell";

export function NightSection() {
  return (
    <SectionShell id="noite" title="A noite que você já conhece">
      <div className="max-w-[38rem] space-y-3 text-muted">
        <p>Mesa senta. Cliente olha o cardápio. Chama alguém. Espera. Repete no rush.</p>
        <p>Garçom anota. Repassa. Cozinha interpreta. Bebida atrasa. Conta refeita.</p>
        <p className="font-semibold text-ink">Não é falta de esforço da equipe.</p>
        <p>É que o pedido ainda depende demais de gente, memória e comunicação.</p>
      </div>
    </SectionShell>
  );
}

export function CostSection() {
  return (
    <SectionShell id="custo" title="O custo não aparece no cardápio">
      <div className="max-w-[38rem] space-y-3 text-muted">
        <p>Pedido errado. Mesa esperando. Bebida atrasada. Cliente que desiste. Conta refeita.</p>
        <p>Separadamente, parecem detalhes. Somados durante uma noite cheia, viram dinheiro.</p>
        <p className="font-semibold text-ink">
          E isso acontece justamente quando sua casa está mais movimentada.
        </p>
      </div>
    </SectionShell>
  );
}

export function QrProblemSection() {
  return (
    <SectionShell id="qr-problema" title="Você pode ter um QR na mesa e continuar com o mesmo problema">
      <div className="max-w-[38rem] space-y-3 text-muted">
        <p>
          <strong className="text-ink">Cardápio digital:</strong> mostra.
        </p>
        <p>
          <strong className="text-ink">Pedido na mesa:</strong> recebe o pedido.
        </p>
        <p className="font-semibold text-brand">O NA MESA foi criado para a segunda situação.</p>
      </div>
    </SectionShell>
  );
}

export function QrFlowSection() {
  return (
    <SectionShell id="qr-fluxo" title="O QR que faz o pedido andar">
      <div className="max-w-[38rem] space-y-3 text-muted">
        <p>
          Cliente senta → escaneia → escolhe → envia → pedido no sistema → cozinha recebe → equipe
          acompanha.
        </p>
        <p className="font-semibold text-ink">
          O NA MESA tira o pedido do bloco e coloca o pedido dentro da operação.
        </p>
      </div>
    </SectionShell>
  );
}

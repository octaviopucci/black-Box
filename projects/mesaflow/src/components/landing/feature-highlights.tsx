import { LayoutDashboard, RotateCcw, Split, Timer, UtensilsCrossed, Wifi } from "lucide-react";

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "Rodízio e alta rotatividade",
    desc: "Fluxo pensado para casas de carne e rodízios — pedidos contínuos sem travar a operação.",
  },
  {
    icon: Split,
    title: "Divisão de conta inteligente",
    desc: "Cada um paga o seu, seleciona itens ou fecha a mesa — sem planilha no fim da noite.",
  },
  {
    icon: Timer,
    title: "Giro de mesa mais rápido",
    desc: "Menos idas do garçom, pedido direto na cozinha e fechamento com OK do restaurante.",
  },
  {
    icon: RotateCcw,
    title: "Comanda e sessão por mesa",
    desc: "Participantes entram na mesma sessão; staff vê tudo no painel em tempo real.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel operacional",
    desc: "Dashboard, pedidos, produtos, QR Codes e cockpit de pagamento — simples para o time.",
  },
  {
    icon: Wifi,
    title: "Tempo real de ponta a ponta",
    desc: "Cliente, cozinha e salão sincronizados — status de pedido e conta sempre atualizados.",
  },
];

export function FeatureHighlights() {
  return (
    <section id="recursos" className="mt-24 scroll-mt-8">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          Feito para restaurante presencial
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Bar, casa de carne, padaria com mesa — onde a dor é giro de mesa e divisão de conta, não entrega
          em domicílio.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card p-6 transition hover:border-brand/20">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

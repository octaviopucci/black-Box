import { Headphones, Package, Settings, Sparkles } from "lucide-react";

const PILLARS = [
  {
    icon: Package,
    title: "Kit físico elegante",
    desc: "QR identificado, display acrílico, guia da mesa e caixa premium — presença na mesa que convida a usar.",
  },
  {
    icon: Settings,
    title: "Operação completa",
    desc: "Mesas, comandas, rodízio, KDS e fechamento — configurado para o seu salão, não para delivery.",
  },
  {
    icon: Headphones,
    title: "Suporte próximo",
    desc: "Implantação acompanhada e suporte humano quando a operação aperta — inclusive na madrugada.",
  },
  {
    icon: Sparkles,
    title: "Entrada já premium",
    desc: "O plano de entrada traz o que o mercado cobra como upgrade: sessão, KDS, divisão de conta e kit.",
  },
];

export function KitOperation() {
  return (
    <section id="kit" className="mt-24 scroll-mt-8">
      <div className="glass-panel overflow-hidden p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Kit + operação + suporte</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
            Software + presença física na mesa
          </h2>
          <p className="mt-4 text-muted">
            NA MESA não vende PDF com QR. Vende a camada digital de mesa — com kit bonito na mesa, operação
            rodando e alguém do outro lado quando precisar.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-white/6 bg-surface/60 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

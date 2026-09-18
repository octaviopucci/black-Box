import { ArrowRight, ChefHat, QrCode, Receipt, Users } from "lucide-react";

const STEPS = [
  {
    icon: QrCode,
    title: "QR na mesa",
    desc: "Cliente entra na sessão da mesa pelo celular — sem app, sem fila no garçom.",
  },
  {
    icon: Users,
    title: "Sessão + pedidos",
    desc: "Participantes pedem juntos ou separados. Cardápio, carrinho e status em tempo real.",
  },
  {
    icon: ChefHat,
    title: "KDS na cozinha",
    desc: "Pedidos caem direto no setor certo — cozinha, bar ou balcão — sem retrabalho.",
  },
  {
    icon: Receipt,
    title: "Conta + liberação",
    desc: "Conta parcial ou individual. Restaurante confirma antes de liberar a mesa para o próximo grupo.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mt-24 scroll-mt-8">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          Como funciona
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Da sessão na mesa até o OK do restaurante — um fluxo pensado para rodízio, bar, casa de carne e
          padaria com mesa.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="glass-card relative p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-brand/70">Passo {i + 1}</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight
                className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand/30 lg:block"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

import { MESA_FEATURES } from "@/components/landing/landing-data";
import { SectionShell } from "@/components/landing/section-shell";

export function OrganizeMesaSection() {
  return (
    <SectionShell id="organizar-mesa" title="Não é só pedir. É organizar a mesa.">
      <div className="flex flex-wrap gap-2">
        {MESA_FEATURES.map((feature) => (
          <span
            key={feature}
            className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-sm font-semibold text-ink"
          >
            {feature}
          </span>
        ))}
      </div>
      <p className="mt-4 max-w-[38rem] text-muted">
        Não é um monte de ferramentas separadas. É uma mesa sendo acompanhada do pedido ao fechamento.
      </p>
    </SectionShell>
  );
}

export function WaiterSection() {
  return (
    <SectionShell id="garcom" title="E o garçom?">
      <div className="max-w-[38rem] space-y-3 text-muted">
        <p>O NA MESA não foi feito para tirar o garçom da operação.</p>
        <p className="font-semibold text-ink">Foi feito para tirar do garçom o que não precisa depender dele.</p>
        <p>O sistema cuida do caminho do pedido. A equipe cuida da experiência.</p>
      </div>
    </SectionShell>
  );
}

import Link from "next/link";
import { PLANS } from "@/components/landing/landing-data";
import { SectionShell } from "@/components/landing/section-shell";

export function PlansSection() {
  return (
    <SectionShell id="planos" title="Quanto custa?">
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col rounded-2xl border bg-[#1a1a1a] p-5 ${
              plan.recommended ? "border-brand" : "border-[#2a2a2a]"
            }`}
          >
            {plan.recommended ? (
              <span className="mb-2 self-start rounded-full bg-brand px-2 py-1 text-[0.72rem] font-extrabold uppercase tracking-wide text-[#111]">
                Entrada completa
              </span>
            ) : null}
            <h3 className="text-[1.1rem] font-bold uppercase">{plan.name}</h3>
            <p className="mt-2 text-[1.5rem] font-extrabold tracking-tight text-brand">{plan.annualPrice}</p>
            {plan.annualHighlight ? (
              <p className="text-sm font-semibold text-ink">{plan.annualHighlight}</p>
            ) : null}
            {plan.monthlyPrice ? (
              <p className="mt-1 text-sm text-muted">Mensal: {plan.monthlyPrice}</p>
            ) : null}
            {plan.quarterlyPrice ? (
              <p className="text-sm text-muted">Trimestral: {plan.quarterlyPrice}</p>
            ) : null}
            {plan.implantNote ? <p className="mt-2 text-xs text-muted">{plan.implantNote}</p> : null}
            <ul className="my-3 grid flex-1 gap-1.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="relative pl-4 text-[0.92rem] text-muted before:absolute before:left-1 before:font-extrabold before:text-brand before:content-['·']"
                >
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="#contato"
              className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[0.95rem] font-bold transition ${
                plan.recommended
                  ? "bg-brand text-[#111] hover:bg-brand-dark"
                  : "border border-[#444] bg-transparent hover:border-brand/40"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <article className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-5">
        <h3 className="font-bold">Por que o anual?</h3>
        <p className="mt-2 text-muted">
          NA MESA + kit + implantação · ≈ R$83/mês. Mais barato que soluções típicas de salão quando você
          compara o pacote inteiro, não só a mensalidade.
        </p>
      </article>

      <p className="mt-4 text-sm text-muted">
        Não precisa acreditar em promessa. Fale conosco, veja o sistema funcionando e decida com calma.
      </p>
    </SectionShell>
  );
}

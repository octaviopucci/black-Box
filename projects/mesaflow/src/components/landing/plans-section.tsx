import Link from "next/link";
import { PLANS } from "@/components/landing/landing-data";

export function PlansSection() {
  return (
    <section id="planos" className="scroll-mt-16 py-11">
      <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">Planos</h2>
      <p className="mt-2 mb-4 text-muted">
        Preço no ano. Sem enrolação. Premium é o que a maioria das casas escolhe.
      </p>
      <div className="grid gap-3.5 md:grid-cols-3 md:items-stretch">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col gap-2 rounded-2xl border bg-[#1a1a1a] p-5 ${
              plan.recommended ? "border-brand" : "border-[#2a2a2a]"
            }`}
          >
            {plan.recommended ? (
              <span className="self-start rounded-full bg-brand px-2 py-1 text-[0.72rem] font-extrabold uppercase tracking-wide text-[#111]">
                Recomendado
              </span>
            ) : null}
            <h3 className="text-[1.1rem] font-bold">{plan.name}</h3>
            <p className="text-[1.65rem] font-extrabold tracking-tight">
              {plan.id === "custom" ? (
                <>
                  a partir de
                  <br />
                  R$&nbsp;2.997
                  <small className="text-[0.95rem] font-semibold text-muted"> no ano</small>
                </>
              ) : (
                <>
                  {plan.price}
                  <small className="text-[0.95rem] font-semibold text-muted"> no ano</small>
                </>
              )}
            </p>
            <p className="text-sm text-muted">{plan.daily}</p>
            <ul className="my-1 grid gap-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="relative pl-4 text-[0.92rem] text-muted before:absolute before:left-1 before:font-extrabold before:text-brand before:content-['·']">
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="#contato"
              className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[0.95rem] font-bold transition ${
                plan.primaryCta
                  ? "bg-brand text-[#111] hover:bg-brand-dark"
                  : "border border-[#444] bg-transparent hover:border-brand/40"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

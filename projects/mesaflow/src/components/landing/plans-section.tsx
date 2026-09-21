import Link from "next/link";
import { PLANS } from "@/components/landing/landing-data";

export function PlansSection() {
  return (
    <section id="planos" className="scroll-mt-16 py-12">
      <div className="max-w-3xl">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Planos</h2>
        <p className="mt-2 text-muted">Preço no ano. Sem enrolação. Premium é o que a maioria das casas escolhe.</p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex min-h-[420px] flex-col gap-3 rounded-2xl border bg-[#1a1a1a] p-6 ${
              plan.recommended
                ? "z-10 border-brand shadow-[0_24px_48px_-16px_rgba(255,106,0,0.35),0_0_0_1px_rgba(255,106,0,0.25)] lg:-mt-2 lg:mb-2 lg:scale-[1.03]"
                : "border-[#2a2a2a]"
            }`}
          >
            {plan.recommended ? (
              <span className="self-start rounded-full bg-brand px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-wide text-[#111]">
                Recomendado
              </span>
            ) : (
              <span className="h-[1.65rem]" aria-hidden />
            )}

            <h3 className="text-xl font-bold">{plan.name}</h3>

            <div>
              {plan.id === "custom" ? (
                <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-tight tracking-tight">
                  <span className="block text-base font-semibold text-muted">a partir de</span>
                  {plan.price}
                  <span className="text-lg font-semibold text-muted"> /ano</span>
                </p>
              ) : (
                <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-tight tracking-tight">
                  {plan.price}
                  <span className="text-lg font-semibold text-muted"> /ano</span>
                </p>
              )}
              <p className="mt-1 text-sm font-medium text-brand">{plan.daily}</p>
            </div>

            <ul className="my-2 flex-1 grid gap-2 border-t border-[#2a2a2a] pt-4">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="relative pl-4 text-[0.92rem] leading-snug text-muted before:absolute before:left-0 before:font-extrabold before:text-brand before:content-['·']"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="#contato"
              className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-base font-bold transition ${
                plan.primaryCta
                  ? "bg-brand text-[#111] shadow-[0_10px_28px_-8px_rgba(255,106,0,0.6)] hover:bg-brand-dark"
                  : "border border-[#444] bg-transparent hover:border-brand/50"
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

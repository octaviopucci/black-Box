import { PROOF_SLOTS } from "@/components/landing/landing-data";
import { ProductMockup } from "@/components/landing/product-mockups";
import { SectionShell } from "@/components/landing/section-shell";

export function ProofSection() {
  return (
    <SectionShell id="prova" title="Prova">
      <p className="mb-6 max-w-[38rem] text-muted">
        O produto real, do QR ao fechamento. Interface escura, laranja NA MESA, operação de salão.
      </p>
      <div className="grid gap-8">
        {PROOF_SLOTS.map(({ id, step, title, desc }) => (
          <article
            key={id}
            className="grid items-center gap-6 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 md:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand">{step}</p>
              <h3 className="mt-1 text-lg font-extrabold">{title}</h3>
              <p className="mt-1 text-muted">{desc}</p>
            </div>
            <ProductMockup variant={id} className="md:max-w-[320px]" />
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

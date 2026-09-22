import { SectionShell } from "@/components/landing/section-shell";

export function BeforeAfterSection() {
  return (
    <SectionShell id="antes-depois" title="Antes / Depois">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Antes</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Cliente → chama → espera → garçom anota → repassa → cozinha interpreta → produz
          </p>
        </article>
        <article className="rounded-xl border border-brand/40 bg-brand/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand">Com NA MESA</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Cliente → pede → sistema recebe → cozinha produz
          </p>
        </article>
      </div>
      <p className="mt-4 max-w-[38rem] text-muted">
        É essa mudança que faz um QR deixar de ser apenas um cardápio.
      </p>
    </SectionShell>
  );
}

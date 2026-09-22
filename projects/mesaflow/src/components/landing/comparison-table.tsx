import { COMPARISON_ROWS } from "@/components/landing/landing-data";
import { SectionShell } from "@/components/landing/section-shell";

export function ComparisonTable() {
  return (
    <SectionShell
      id="comparativo"
      eyebrow="Mesmo jogo. O pacote muda."
      title="Não compare só a mensalidade. Compare o que realmente entra na operação."
    >
      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <th className="px-4 py-3 font-bold text-muted" scope="col" />
              <th className="px-4 py-3 font-bold text-muted" scope="col">
                Outras soluções de salão
              </th>
              <th className="px-4 py-3 font-bold text-brand" scope="col">
                NA MESA · Essencial anual
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label} className="border-b border-[#2a2a2a] last:border-0">
                <th className="px-4 py-3 font-semibold text-ink" scope="row">
                  {row.label}
                </th>
                <td className="px-4 py-3 text-muted">{row.others}</td>
                <td className="px-4 py-3 text-ink">{row.naMesa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 max-w-[38rem] space-y-2 text-muted">
        <p>A diferença não está no QR. Está no que acontece depois que o cliente escaneia.</p>
        <p className="font-semibold text-ink">
          No NA MESA, o Essencial já nasce para colocar o salão para funcionar.
        </p>
      </div>
    </SectionShell>
  );
}

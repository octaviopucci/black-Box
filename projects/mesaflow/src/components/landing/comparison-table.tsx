import { Check, Minus } from "lucide-react";

type Row = {
  feature: string;
  menuQr: boolean | string;
  pdvSuite: boolean | string;
  deliveryFirst: boolean | string;
  naMesa: boolean | string;
  highlight?: boolean;
};

const ROWS: Row[] = [
  {
    feature: "Foco em mesa presencial (giro + divisão de conta)",
    menuQr: "Parcial",
    pdvSuite: "Parcial",
    deliveryFirst: "Não",
    naMesa: true,
    highlight: true,
  },
  {
    feature: "Sessão por mesa com participantes",
    menuQr: false,
    pdvSuite: "Parcial",
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "Pedido direto no KDS (cozinha/bar)",
    menuQr: "Parcial",
    pdvSuite: true,
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "Conta parcial / individual antes de sair",
    menuQr: false,
    pdvSuite: "Parcial",
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "OK do restaurante antes de liberar a mesa",
    menuQr: false,
    pdvSuite: true,
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "Kit físico elegante por mesa (QR + display)",
    menuQr: "Parcial",
    pdvSuite: false,
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "Implantação + suporte próximo (incl. madrugada)",
    menuQr: false,
    pdvSuite: "Parcial",
    deliveryFirst: false,
    naMesa: true,
  },
  {
    feature: "Plano de entrada com recursos premium inclusos",
    menuQr: false,
    pdvSuite: false,
    deliveryFirst: false,
    naMesa: true,
    highlight: true,
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center gap-1 text-success">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        <span className="sr-only">Sim</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center text-muted/50">
        <Minus className="h-4 w-4" aria-hidden />
        <span className="sr-only">Não</span>
      </span>
    );
  }
  return <span className="text-xs text-muted">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section id="comparativo" className="mt-24 scroll-mt-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Mais por menos</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          NA MESA vs. o que o mercado oferece
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
          Sem citar marcas — categorias que você já conhece: apps de cardápio/QR, suites PDV completas e
          plataformas delivery-first. NA MESA é a camada digital de mesa feita para quem vive do salão.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-surface-2/80">
              <th className="p-4 font-medium text-muted">Recurso</th>
              <th className="p-4 font-medium text-muted">Apps cardápio / QR</th>
              <th className="p-4 font-medium text-muted">PDV / suite completa</th>
              <th className="p-4 font-medium text-muted">Delivery-first</th>
              <th className="p-4 bg-brand/10 font-semibold text-brand">NA MESA</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.feature}
                className={`border-b border-white/5 ${row.highlight ? "bg-brand/5" : ""}`}
              >
                <td className="p-4 font-medium">{row.feature}</td>
                <td className="p-4 text-center">
                  <Cell value={row.menuQr} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.pdvSuite} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.deliveryFirst} />
                </td>
                <td className="bg-brand/5 p-4 text-center">
                  <Cell value={row.naMesa} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import Link from "next/link";
import { QrCode, Sparkles, UtensilsCrossed } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-80" />
      <div className="relative mx-auto grid min-h-dvh max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            MesaFlow
          </Link>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand">Garçom digital</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight">
              Pedidos na mesa,<br />cozinha em tempo real.
            </h1>
            <p className="mt-4 max-w-md text-muted">
              QR Code, cardápio mobile, KDS e painel — tudo que seu restaurante precisa em um só lugar.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: QrCode, text: "QR Code por mesa em segundos" },
                { icon: Sparkles, text: "Cardápio bonito no celular do cliente" },
                { icon: UtensilsCrossed, text: "Pedidos direto na cozinha e no bar" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-ink/90">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Icon className="h-4 w-4 text-brand" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted">© MesaFlow · feito para food service</p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="glass-panel w-full max-w-md p-8 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">MesaFlow</Link>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

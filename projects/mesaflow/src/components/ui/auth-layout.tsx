import { Logo } from "@/components/brand/logo";
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
        <div className="hidden flex-col items-center justify-center p-10 lg:flex">
          <Logo variant="vertical" href={null} className="mb-10 max-w-[260px]" />
          <ul className="w-full max-w-sm space-y-4">
            {[
              { icon: QrCode, text: "QR Code por mesa em segundos" },
              { icon: Sparkles, text: "Cardápio bonito no celular do cliente" },
              { icon: UtensilsCrossed, text: "Pedidos direto na cozinha e no bar" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ink/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 ring-1 ring-brand/20">
                  <Icon className="h-4 w-4 text-brand" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-muted">© MesaFlow · Seu pedido, sem espera</p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="glass-panel w-full max-w-md p-8 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Logo showTagline />
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

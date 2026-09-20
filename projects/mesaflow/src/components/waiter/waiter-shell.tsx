"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Receipt, ShoppingBag, Table2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/waiter", label: "Mesas", icon: Table2 },
  { href: "/waiter/orders", label: "Pedidos", icon: ShoppingBag },
];

export function WaiterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/waiter/login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">Acesso do Garçom</p>
            <p className="truncate text-sm font-semibold">{session?.user.name}</p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-1 px-2 py-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium",
                  active ? "bg-brand/15 text-brand" : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function WaiterTableStatus({ status }: { status: string }) {
  const map: Record<string, string> = {
    LIVRE: "bg-success/15 text-success",
    OCUPADA: "bg-brand/15 text-brand",
    AGUARDANDO_PAGAMENTO: "bg-warning/15 text-warning",
    RESERVADA: "bg-brand-soft/15 text-brand-soft",
  };
  const labels: Record<string, string> = {
    LIVRE: "Livre",
    OCUPADA: "Ocupada",
    AGUARDANDO_PAGAMENTO: "Conta",
    RESERVADA: "Reservada",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", map[status] || "bg-white/5 text-muted")}>
      {labels[status] || status}
    </span>
  );
}

export function WaiterActionButton({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-base font-semibold transition active:scale-[0.98]",
        variant === "primary" && "bg-brand text-white shadow-lg shadow-brand/20",
        variant === "secondary" && "border border-white/10 bg-white/5 text-foreground",
        variant === "danger" && "border border-danger/30 bg-danger/10 text-danger",
        props.disabled && "opacity-50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function WaiterAccountIcon() {
  return <Receipt className="h-5 w-5" />;
}

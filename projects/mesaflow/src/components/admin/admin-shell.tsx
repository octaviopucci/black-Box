"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  QrCode,
  ShoppingBag,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/tables", label: "Mesas", icon: Table2 },
  { href: "/admin/qrcodes", label: "QR Codes", icon: QrCode },
  { href: "/kds/sec_cozinha", label: "KDS Cozinha", icon: ChefHat },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    sessionStorage.removeItem("mesaflow_admin");
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-dvh bg-[#0b0f14] text-ink">
      <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-surface p-4 lg:block">
        <p className="mb-6 font-[family-name:var(--font-display)] text-lg font-bold text-brand">MesaFlow</p>
        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                pathname === href ? "bg-brand/20 text-brand" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}

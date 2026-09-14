"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  QrCode,
  ShoppingBag,
  Table2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Sector } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/tables", label: "Mesas", icon: Table2 },
  { href: "/admin/qrcodes", label: "QR Codes", icon: QrCode },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout, authHeaders } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    if (!session?.establishment.slug) return;
    fetch(apiUrl(`/admin/dashboard?slug=${encodeURIComponent(session.establishment.slug)}`), {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((json) => setSectors(json.sectors || []));
  }, [session?.establishment.slug, authHeaders]);

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  const kdsLinks = sectors.slice(0, 3);

  return (
    <div className="flex min-h-dvh bg-surface text-ink">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-surface-2/50 p-5 backdrop-blur lg:block">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 ring-1 ring-brand/25 text-brand font-bold">M</span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] font-bold">MesaFlow</p>
            <p className="truncate text-xs text-muted">{session?.establishment.name}</p>
          </div>
        </div>
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
          {kdsLinks.map((s) => (
            <Link
              key={s.id}
              href={`/kds/live?sector=${encodeURIComponent(s.id)}&slug=${encodeURIComponent(session?.establishment.slug || "")}`}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                pathname === `/kds/${s.id}` ? "bg-brand/20 text-brand" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <ChefHat className="h-4 w-4" />
              KDS {s.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
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

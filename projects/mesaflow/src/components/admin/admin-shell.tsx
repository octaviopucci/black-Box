"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChefHat,
  LayoutGrid,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Plug,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Table2,
  X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/contexts/auth-context";
import { parseApiJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Sector, UserRole } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/products", label: "Produtos", icon: LayoutGrid },
  { href: "/admin/tables", label: "Mesas", icon: Table2 },
  { href: "/admin/operations", label: "Controle", icon: ShieldAlert },
  { href: "/admin/qrcodes", label: "QR Codes", icon: QrCode },
  { href: "/admin/integrations", label: "Integrações", icon: Plug },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

const ROLE_NAV: Record<UserRole, string[] | "*"> = {
  OWNER: "*",
  MANAGER: "*",
  WAITER: ["/admin", "/admin/orders", "/admin/tables", "/admin/operations", "/admin/qrcodes"],
  KITCHEN: ["/admin", "/admin/orders", "/admin/operations"],
  COUNTER: ["/admin", "/admin/orders", "/admin/tables", "/admin/operations", "/admin/qrcodes"] };

function navForRole(role: UserRole | undefined) {
  if (!role) return NAV;
  const allowed = ROLE_NAV[role];
  if (allowed === "*") return NAV;
  return NAV.filter((item) => allowed.includes(item.href));
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout, fetchApi } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!session?.establishment.slug) return;
    fetchApi("/admin/dashboard?scope=nav")
      .then(async (response) => {
        const json = (await parseApiJson(response)) as {
          sectors?: Sector[];
          persist?: { shared?: boolean; warning?: string };
        };
        if (!response.ok) return;
        setSectors(json.sectors || []);
        setPersistWarning(json.persist?.shared ? null : json.persist?.warning ?? null);
      })
      .catch(() => undefined);
  }, [session?.establishment.slug, fetchApi]);

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  const kdsLinks = sectors.slice(0, 3);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const roleNav = navForRole(session?.user.role);
  const mobileNav = roleNav.slice(0, 5);

  const navigation = (
    <nav className="space-y-1">
      {roleNav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            isActive(href) ? "bg-brand/15 text-brand shadow-inner shadow-brand/5" : "text-muted hover:bg-white/5 hover:text-ink",
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
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
        >
          <ChefHat className="h-4 w-4" />
          KDS {s.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-surface text-ink">
      <aside className="print-hide hidden w-64 shrink-0 border-r border-white/5 bg-surface-2/80 p-5 backdrop-blur-xl lg:block">
        <div className="mb-8">
          <Logo href="/admin" iconSize={36} />
          <p className="mt-3 truncate text-xs text-muted">{session?.establishment.name}</p>
        </div>
        {navigation}
        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="print-hide sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-surface/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Logo href="/admin" iconSize={32} />
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-xl bg-surface-2 p-2.5 text-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {mobileOpen && (
          <div className="print-hide fixed inset-0 z-50 bg-black/65 lg:hidden" onClick={() => setMobileOpen(false)}>
            <aside
              className="ml-auto flex h-full w-[min(20rem,88vw)] flex-col border-l border-white/10 bg-surface p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-bold">Administração</p>
                  <p className="max-w-52 truncate text-xs text-muted">{session?.establishment.name}</p>
                </div>
                <button type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{navigation}</div>
              <button onClick={handleLogout} className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </aside>
          </div>
        )}

        {persistWarning && (
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning lg:px-8">
            {persistWarning}
          </div>
        )}
        <main className="min-w-0 p-4 pb-24 lg:p-8">{children}</main>
        <nav
          className="print-hide fixed inset-x-0 bottom-0 z-30 grid border-t border-white/10 bg-surface/90 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
          style={{ gridTemplateColumns: `repeat(${Math.max(mobileNav.length, 1)}, minmax(0, 1fr))` }}
        >
          {mobileNav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 py-1 text-[10px]", isActive(href) ? "text-brand" : "text-muted")}>
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

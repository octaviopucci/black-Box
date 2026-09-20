"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
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
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/contexts/auth-context";
import { useOrderAlerts } from "@/hooks/use-order-alerts";
import { parseApiJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import {
  isOrderSoundMuted,
  isOrderSoundUnlocked,
  playOrderBell,
  setOrderSoundMuted,
  setupOrderSoundAutoUnlock,
  subscribeOrderSoundUnlock,
  unlockOrderSound,
} from "@/lib/order-alert-sound";
import type { Sector, UserRole } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/products", label: "Produtos", icon: LayoutGrid },
  { href: "/admin/tables", label: "Mesas", icon: Table2 },
  { href: "/admin/waiters", label: "Garçons", icon: UserPlusIcon },
  { href: "/admin/operations", label: "Controle", icon: ShieldAlert },
  { href: "/admin/qrcodes", label: "QR Codes", icon: QrCode },
  { href: "/admin/integrations", label: "Integrações", icon: Plug },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

const ROLE_NAV: Record<UserRole, string[] | "*"> = {
  OWNER: "*",
  MANAGER: "*",
  WAITER: ["/waiter", "/waiter/orders", "/waiter/table", "/waiter/login"],
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
  const [soundMuted, setSoundMuted] = useState(false);
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const {
    notificationPermission,
    enableNotifications,
    pendingAlerts,
    dismissAlert,
    dismissAllAlerts,
  } = useOrderAlerts();

  useEffect(() => {
    setSoundMuted(isOrderSoundMuted());
    setSoundUnlocked(isOrderSoundUnlocked());
    return subscribeOrderSoundUnlock(() => setSoundUnlocked(true));
  }, []);

  useEffect(() => setupOrderSoundAutoUnlock(), []);

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

  async function activateSoundAlerts() {
    const unlockedNow = await unlockOrderSound();
    setSoundUnlocked(unlockedNow || isOrderSoundUnlocked());
    if (notificationPermission !== "granted") {
      await enableNotifications();
    }
  }

  async function toggleSound() {
    const next = !soundMuted;
    setSoundMuted(next);
    setOrderSoundMuted(next);
    if (!next) {
      await activateSoundAlerts();
    }
  }

  async function handleUnlockSoundPrompt() {
    setSoundMuted(false);
    setOrderSoundMuted(false);
    const unlockedNow = await unlockOrderSound();
    setSoundUnlocked(unlockedNow || isOrderSoundUnlocked());
    if (unlockedNow) {
      void playOrderBell();
    }
    if (notificationPermission !== "granted") {
      await enableNotifications();
    }
  }

  const soundToggle = (
    <button
      type="button"
      onClick={() => void toggleSound()}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-sm text-muted transition hover:bg-surface-3"
      aria-pressed={soundMuted}
      title={
        notificationPermission === "denied"
          ? "Notificações bloqueadas no browser — permita nas configurações"
          : notificationPermission === "granted"
            ? "Alertas de som e notificação ativos"
            : "Clique para ativar som e pedir permissão de notificação"
      }
    >
      {soundMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {soundMuted ? "Som desligado" : "Alertas ligados"}
    </button>
  );

  const kdsLinks = sectors.slice(0, 3);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function openOrderAlert(orderId: string) {
    dismissAlert(orderId);
    router.push(`/admin/orders?order=${encodeURIComponent(orderId)}`);
  }

  const entitlements = session?.entitlements;
  const roleNav = navForRole(session?.user.role).filter((item) => {
    if (item.href === "/admin/waiters" && entitlements && !entitlements.features.waiter_access) {
      return false;
    }
    if (item.href === "/admin/integrations" && entitlements && !entitlements.features.integrations) {
      return false;
    }
    return true;
  });
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
        <div className="mt-8 space-y-3">
          {soundToggle}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="print-hide sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-white/5 bg-surface/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Logo href="/admin" iconSize={32} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleSound()}
              aria-pressed={soundMuted}
              aria-label={soundMuted ? "Som desligado" : "Alertas ligados"}
              className="rounded-xl bg-surface-2 p-2.5 text-muted"
            >
              {soundMuted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="rounded-xl bg-surface-2 p-2.5 text-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
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

        {!soundUnlocked && !soundMuted && (
          <div className="sticky top-0 z-50 border-b border-brand/40 bg-brand/15 px-4 py-3 shadow-md backdrop-blur-sm lg:px-8">
            <button
              type="button"
              onClick={() => void handleUnlockSoundPrompt()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand/90"
            >
              <Bell className="h-5 w-5" />
              Toque para ativar alertas sonoros
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              O browser exige um toque antes de tocar o sino de novos pedidos.
            </p>
          </div>
        )}

        {pendingAlerts.length > 0 && (
          <div className="sticky top-0 z-40 border-b border-yellow-500/40 bg-yellow-400/95 px-4 py-3 text-yellow-950 shadow-md lg:px-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                {pendingAlerts.map(({ order }) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => openOrderAlert(order.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl bg-yellow-300/80 px-4 py-3 text-left font-semibold transition hover:bg-yellow-200/90"
                  >
                    <span className="min-w-0 truncate">
                      Novo pedido #{order.number} · Mesa {order.tableNumber}
                    </span>
                    <span className="shrink-0 text-sm font-bold">{formatCurrency(order.total)}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={dismissAllAlerts}
                aria-label="Fechar alertas de pedido"
                className="shrink-0 rounded-lg p-1.5 text-yellow-950/70 transition hover:bg-yellow-300/60 hover:text-yellow-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {pathname !== "/admin/orders" && pendingAlerts.length === 1 && (
              <p className="mt-2 text-xs font-medium text-yellow-950/80">
                Toque no alerta para abrir o pedido em Pedidos.
              </p>
            )}
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

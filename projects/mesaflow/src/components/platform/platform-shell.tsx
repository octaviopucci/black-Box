"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { cn } from "@/lib/cn";
import { BRAND_NAME } from "@/lib/brand";

const NAV = [
  { href: "/platform", label: "Visão geral", icon: LayoutDashboard },
  { href: "/platform/merchants", label: "Lojistas", icon: Building2 },
];

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = usePlatformAuth();

  function handleLogout() {
    logout();
    router.push("/platform/login");
  }

  const isActive = (href: string) =>
    href === "/platform" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo variant="icon" href="/platform" className="h-9 w-9" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Admin da plataforma
              </p>
              <h1 className="text-sm font-bold text-ink">{BRAND_NAME} — Operação</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-muted">{session?.user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted hover:bg-white/5 hover:text-ink"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-white/5 bg-surface-2 p-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive(href)
                    ? "bg-indigo-500/15 text-indigo-300 shadow-inner shadow-indigo-500/5"
                    : "text-muted hover:bg-white/5 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="mt-4 border-t border-white/5 pt-3">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Referência
              </p>
              <Link
                href="/admin/login"
                className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted hover:bg-white/5 hover:text-ink"
              >
                Painel do lojista →
              </Link>
            </div>
          </nav>
        </aside>

        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-surface/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-medium",
                isActive(href) ? "text-indigo-300" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

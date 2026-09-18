"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseKdsRoute } from "@/lib/parse-route";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { BRAND_NAME } from "@/lib/brand";
import { DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import { minutesSince } from "@/lib/format";
import type { OrderStatus, Sector } from "@/lib/types";
import { cn } from "@/lib/cn";

type KdsTicket = {
  order: {
    id: string;
    number: number;
    tableNumber: string;
    status: OrderStatus;
    createdAt: string;
    establishmentId: string;
  };
  items: Array<{ id: string; qty: number; productName: string; notes?: string }>;
  participantName: string;
};

export function KdsView({ sectorId }: { sectorId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const search = params.toString();
  const resolvedSector =
    parseKdsRoute(pathname, search ? `?${search}` : "") || (sectorId !== "live" ? sectorId : "");
  const slug = params.get("slug") || DEMO_ESTABLISHMENT_SLUG;
  const [tickets, setTickets] = useState<KdsTicket[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorName, setSectorName] = useState("KDS");
  const [establishmentId, setEstablishmentId] = useState<string | undefined>();
  const [authError, setAuthError] = useState(false);
  const prevCount = useRef(0);

  const load = useCallback(async () => {
    if (!resolvedSector) return;
    const res = await fetch(
      apiUrl(`/kds/queue?sector=${encodeURIComponent(resolvedSector)}`),
      { credentials: "include" },
    );
    if (res.status === 401) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    const json = await res.json();
    setTickets(json.tickets || []);
    setSectors(json.sectors || []);
    if (json.sector?.name) setSectorName(json.sector.name);
    const firstOrder = json.tickets?.[0]?.order;
    if (firstOrder?.establishmentId) setEstablishmentId(firstOrder.establishmentId);

    const count = (json.tickets || []).length;
    if (json.soundNotifications !== false && count > prevCount.current && prevCount.current > 0) {
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
        void audio.play().catch(() => undefined);
      } catch {
        /* optional sound */
      }
    }
    prevCount.current = count;
  }, [resolvedSector]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(establishmentId, load);

  const sectorTabs = useMemo(
    () => sectors.filter((sector) => sector.active).slice(0, 6),
    [sectors],
  );

  function switchSector(nextSectorId: string) {
    const query = new URLSearchParams(params.toString());
    query.set("sector", nextSectorId);
    query.set("slug", slug);
    router.push(`/kds/live?${query.toString()}`);
  }

  async function setStatus(orderId: string, status: OrderStatus) {
    await fetch(apiUrl(`/orders/${orderId}`), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!resolvedSector) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface p-6 text-center text-muted">
        Setor não informado. Abra o KDS pelo painel admin.
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface p-6 text-center">
        <p className="text-lg font-semibold">Faça login no painel para usar o KDS</p>
        <p className="max-w-sm text-sm text-muted">
          Cozinha e balcão precisam de sessão ativa (OWNER, MANAGER, KITCHEN ou COUNTER).
        </p>
        <Link href="/admin/login" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
          Ir para login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface p-3 text-ink sm:p-4">
      <header className="mb-4 border-b border-white/10 pb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin"
              className="shrink-0 rounded-xl bg-white/10 p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label="Voltar ao painel"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Logo variant="icon" href={null} iconSize={32} />
            <div className="min-w-0">
              <p className="truncate text-[10px] uppercase tracking-widest text-brand sm:text-xs">
                KDS · {BRAND_NAME}
              </p>
              <h1 className="truncate text-xl font-bold sm:text-3xl">{sectorName}</h1>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm">
            {tickets.length} tickets
          </span>
        </div>
        {sectorTabs.length > 1 && (
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {sectorTabs.map((sector) => (
              <button
                key={sector.id}
                type="button"
                onClick={() => switchSector(sector.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm",
                  sector.id === resolvedSector
                    ? "bg-brand text-white"
                    : "bg-white/10 text-muted hover:bg-white/15 hover:text-ink",
                )}
              >
                {sector.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map(({ order, items, participantName }) => {
          const late = minutesSince(order.createdAt) > 12;
          return (
            <div
              key={order.id}
              className={cn(
                "rounded-2xl border-2 p-4 transition sm:p-5",
                late ? "border-danger bg-danger/10 shadow-lg shadow-danger/10" : "border-white/10 bg-surface-2",
              )}
            >
              <div className="mb-3 flex items-baseline justify-between gap-2 sm:mb-4">
                <div>
                  <p className="text-xl font-black sm:text-2xl">MESA {order.tableNumber}</p>
                  <p className="text-xs text-white/50 sm:text-sm">
                    #{order.number} · {participantName}
                  </p>
                </div>
                <p className={cn("text-base font-bold sm:text-lg", late && "animate-pulse-ring text-danger")}>
                  {minutesSince(order.createdAt)} min
                </p>
              </div>
              <ul className="mb-4 space-y-2 text-lg font-semibold sm:text-xl">
                {items.map((item) => (
                  <li key={item.id}>
                    {item.qty}x {item.productName}
                    {item.notes && <p className="text-sm font-normal text-warning">OBS: {item.notes}</p>}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                {order.status === "NOVO" || order.status === "ACEITO" ? (
                  <Button className="flex-1" size="lg" onClick={() => setStatus(order.id, "EM_PREPARO")}>
                    Iniciar
                  </Button>
                ) : null}
                {order.status === "EM_PREPARO" && (
                  <Button className="flex-1" size="lg" onClick={() => setStatus(order.id, "PRONTO")}>
                    Pronto
                  </Button>
                )}
                {order.status === "PRONTO" && (
                  <Button
                    className="flex-1"
                    variant="secondary"
                    size="lg"
                    onClick={() => setStatus(order.id, "ENTREGUE")}
                  >
                    Entregue
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {tickets.length === 0 && (
          <p className="col-span-full py-16 text-center text-lg text-white/40 sm:py-20 sm:text-2xl">
            Nenhum pedido no momento ✨
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseKdsRoute } from "@/lib/parse-route";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import { minutesSince } from "@/lib/format";
import type { Order, OrderStatus, Sector } from "@/lib/types";
import { cn } from "@/lib/cn";

export function KdsView({ sectorId }: { sectorId: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const search = params.toString();
  const resolvedSector =
    parseKdsRoute(pathname, search ? `?${search}` : "") || (sectorId !== "live" ? sectorId : "");
  const slug = params.get("slug") || DEMO_ESTABLISHMENT_SLUG;
  const [orders, setOrders] = useState<Order[]>([]);
  const [sectorName, setSectorName] = useState("KDS");

  const authHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    try {
      const raw = sessionStorage.getItem("mesaflow_admin");
      if (!raw) return headers;
      const token = (JSON.parse(raw) as { token?: string }).token;
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
    return headers;
  }, []);

  const load = useCallback(async () => {
    if (!resolvedSector) return;
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${encodeURIComponent(slug)}`), {
      headers: authHeaders(),
    });
    const json = await res.json();
    setOrders(json.orders || []);
    const sector = (json.sectors as Sector[] | undefined)?.find((s) => s.id === resolvedSector);
    if (sector) setSectorName(sector.name);
  }, [slug, resolvedSector, authHeaders]);

  useEffect(() => {
    load();
  }, [load]);

  const establishmentId = orders[0]?.establishmentId;
  useRealtime(establishmentId, load);

  const tickets = useMemo(() => {
    if (!resolvedSector) return [];
    return orders
      .filter((o) => !["ENTREGUE", "CANCELADO"].includes(o.status))
      .flatMap((order) => {
        const items = order.items.filter((i) => i.sectorId === resolvedSector);
        if (!items.length) return [];
        return [{ order, items }];
      });
  }, [orders, resolvedSector]);

  async function setStatus(orderId: string, status: OrderStatus) {
    await fetch(apiUrl(`/orders/${orderId}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!resolvedSector) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-muted">
        Setor não informado. Abra o KDS pelo painel admin.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a0a0a] p-4 text-white">
      <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <Logo variant="icon" href={null} iconSize={36} />
          <div>
            <p className="text-xs uppercase tracking-widest text-brand">KDS · MesaFlow</p>
            <h1 className="text-3xl font-bold">{sectorName}</h1>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm">{tickets.length} tickets</span>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map(({ order, items }) => {
          const late = minutesSince(order.createdAt) > 12;
          return (
            <div
              key={order.id}
              className={cn(
                "rounded-2xl border-2 p-5 transition",
                late ? "border-danger bg-danger/10 shadow-lg shadow-danger/10" : "border-white/10 bg-[#141414]",
              )}
            >
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-black">MESA {order.tableNumber}</p>
                  <p className="text-sm text-white/50">Pedido #{order.number}</p>
                </div>
                <p className={cn("text-lg font-bold", late && "text-danger animate-pulse-ring")}>
                  {minutesSince(order.createdAt)} min
                </p>
              </div>
              <ul className="mb-4 space-y-2 text-xl font-semibold">
                {items.map((i) => (
                  <li key={i.id}>
                    {i.qty}x {i.productName}
                    {i.notes && <p className="text-sm font-normal text-warning">OBS: {i.notes}</p>}
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
                  <Button className="flex-1" variant="secondary" size="lg" onClick={() => setStatus(order.id, "ENTREGUE")}>
                    Entregue
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {tickets.length === 0 && (
          <p className="col-span-full py-20 text-center text-2xl text-white/40">Nenhum pedido no momento ✨</p>
        )}
      </div>
    </div>
  );
}

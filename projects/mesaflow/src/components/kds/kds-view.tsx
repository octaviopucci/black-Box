"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import { minutesSince } from "@/lib/format";
import type { Order, OrderStatus, Sector } from "@/lib/types";
import { cn } from "@/lib/cn";

export function KdsView({ sectorId }: { sectorId: string }) {
  const params = useSearchParams();
  const slug = params.get("slug") || DEMO_ESTABLISHMENT_SLUG;
  const [orders, setOrders] = useState<Order[]>([]);
  const [sectorName, setSectorName] = useState("KDS");

  const load = useCallback(async () => {
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${encodeURIComponent(slug)}`));
    const json = await res.json();
    setOrders(json.orders || []);
    const sector = (json.sectors as Sector[] | undefined)?.find((s) => s.id === sectorId);
    if (sector) setSectorName(sector.name);
  }, [slug, sectorId]);

  useEffect(() => {
    load();
  }, [load]);

  const establishmentId = orders[0]?.establishmentId;
  useRealtime(establishmentId, load);

  const tickets = useMemo(() => {
    return orders
      .filter((o) => !["ENTREGUE", "CANCELADO"].includes(o.status))
      .flatMap((order) => {
        const items = order.items.filter((i) => i.sectorId === sectorId);
        if (!items.length) return [];
        return [{ order, items }];
      });
  }, [orders, sectorId]);

  async function setStatus(orderId: string, status: OrderStatus) {
    await fetch(apiUrl(`/orders/${orderId}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="min-h-dvh bg-[#111] p-4 text-white">
      <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">{sectorName}</h1>
        <span className="text-muted">{tickets.length} tickets</span>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map(({ order, items }) => {
          const late = minutesSince(order.createdAt) > 12;
          return (
            <div
              key={order.id}
              className={cn(
                "rounded-2xl border-2 p-5",
                late ? "border-danger bg-danger/10" : "border-white/10 bg-[#1a1a1a]",
              )}
            >
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-black">MESA {order.tableNumber}</p>
                  <p className="text-sm text-muted">Pedido #{order.number}</p>
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
          <p className="col-span-full py-20 text-center text-2xl text-muted">Nenhum pedido no momento</p>
        )}
      </div>
    </div>
  );
}

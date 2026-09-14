"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { formatCurrency, formatTime, minutesSince } from "@/lib/format";
import { DEMO_ESTABLISHMENT_ID, DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "NOVO", label: "Novos" },
  { status: "ACEITO", label: "Aceitos" },
  { status: "EM_PREPARO", label: "Em preparo" },
  { status: "PRONTO", label: "Prontos" },
  { status: "ENTREGUE", label: "Entregues" },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  NOVO: "ACEITO",
  ACEITO: "EM_PREPARO",
  EM_PREPARO: "PRONTO",
  PRONTO: "ENTREGUE",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${DEMO_ESTABLISHMENT_SLUG}`));
    const json = await res.json();
    setOrders(json.orders || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(DEMO_ESTABLISHMENT_ID, load);

  async function advance(id: string, status: OrderStatus) {
    await fetch(apiUrl(`/orders/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const byStatus = useMemo(() => {
    const map: Record<string, Order[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    for (const o of orders) {
      if (o.status === "CANCELADO") continue;
      (map[o.status] ||= []).push(o);
    }
    return map;
  }, [orders]);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">Central de pedidos</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="w-72 shrink-0">
            <h2 className="mb-3 text-sm font-semibold text-muted">{col.label}</h2>
            <div className="space-y-3">
              {(byStatus[col.status] || []).map((order) => {
                const late = minutesSince(order.createdAt) > 15 && !["ENTREGUE", "PRONTO"].includes(order.status);
                return (
                  <div
                    key={order.id}
                    className={cn(
                      "rounded-2xl border bg-surface-2 p-4",
                      late ? "border-danger/50" : "border-white/5",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">#{order.number}</span>
                      <span className="text-xs text-muted">Mesa {order.tableNumber}</span>
                    </div>
                    <p className="text-xs text-muted">{formatTime(order.createdAt)} · {minutesSince(order.createdAt)} min</p>
                    <ul className="my-3 space-y-1 text-sm">
                      {order.items.map((i) => (
                        <li key={i.id}>{i.qty}x {i.productName} <span className="text-xs text-muted">({i.sectorName})</span></li>
                      ))}
                    </ul>
                    {order.notes && <p className="mb-2 text-xs text-warning">OBS: {order.notes}</p>}
                    <p className="mb-3 font-semibold text-brand">{formatCurrency(order.total)}</p>
                    {NEXT[order.status] && (
                      <Button size="sm" className="w-full" onClick={() => advance(order.id, NEXT[order.status]!)}>
                        Avançar → {COLUMNS.find((c) => c.status === NEXT[order.status])?.label}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

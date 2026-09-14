"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/use-admin-data";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { formatCurrency, formatTime, minutesSince } from "@/lib/format";
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
  const { authHeaders } = useAuth();
  const { data, load } = useAdminData<{ orders: Order[] }>();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (data?.orders) setOrders(data.orders);
  }, [data]);

  const byStatus = useMemo(() => {
    const map: Record<string, Order[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    for (const o of orders) {
      if (map[o.status]) map[o.status].push(o);
    }
    return map;
  }, [orders]);

  async function advance(order: Order) {
    const next = NEXT[order.status];
    if (!next) return;
    await fetch(apiUrl(`/orders/${order.id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">Pedidos</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="min-w-[260px] flex-1 rounded-2xl border border-white/5 bg-surface-2 p-4">
            <h2 className="mb-3 font-semibold">{col.label} ({byStatus[col.status]?.length || 0})</h2>
            <ul className="space-y-3">
              {(byStatus[col.status] || []).map((o) => (
                <li key={o.id} className="rounded-xl bg-surface p-3 text-sm">
                  <div className="flex items-baseline justify-between">
                    <p className="font-bold">#{o.number} · Mesa {o.tableNumber}</p>
                    <span className={cn("text-xs", minutesSince(o.createdAt) > 15 && "text-danger")}>
                      {minutesSince(o.createdAt)} min
                    </span>
                  </div>
                  <p className="text-muted">{formatTime(o.createdAt)} · {formatCurrency(o.total)}</p>
                  <ul className="mt-2 space-y-1">
                    {o.items.map((i) => (
                      <li key={i.id}>{i.qty}x {i.productName}</li>
                    ))}
                  </ul>
                  {NEXT[o.status] && (
                    <Button size="sm" className="mt-2 w-full" onClick={() => advance(o)}>
                      Avançar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

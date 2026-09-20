"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { formatCurrency, formatTime } from "@/lib/format";
import type { Order } from "@/lib/types";

type EnrichedOrder = Order & { originLabel?: string };

export default function WaiterOrdersPage() {
  const { fetchApi } = useAuth();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchApi("/admin/orders");
    const json = await res.json();
    if (res.ok) setOrders(json.orders || []);
    setLoading(false);
  }, [fetchApi]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 8000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted">Cliente vs Garçom</p>
      </div>

      {loading && !orders.length ? (
        <p className="py-8 text-center text-sm text-muted">Carregando…</p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 40).map((order) => (
            <div key={order.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                  Mesa {order.tableNumber} · #{order.number}
                </p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">
                  {order.originLabel || (order.orderOrigin === "WAITER" ? "Garçom" : "Cliente")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {formatCurrency(order.total)} · {formatTime(order.createdAt)}
              </p>
            </div>
          ))}
          {!orders.length && <p className="text-sm text-muted">Nenhum pedido recente.</p>}
        </div>
      )}
    </div>
  );
}

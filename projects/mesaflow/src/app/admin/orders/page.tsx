"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrderDetailPanel } from "@/components/admin/order-detail-panel";
import { useAdminData } from "@/hooks/use-admin-data";
import { formatItemPreview, serviceTypeLabel, type EnrichedOrder } from "@/lib/order-display";
import { useAuth } from "@/contexts/auth-context";
import { formatCurrency, formatTime, minutesSince } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
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
  const { fetchApi } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, load, establishment } = useAdminData<{ orders: EnrichedOrder[] }>();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (data?.orders) setOrders(data.orders);
  }, [data]);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam && orders.some((o) => o.id === orderParam)) {
      setSelectedId(orderParam);
    }
  }, [searchParams, orders]);

  const flatList = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );

  const selectedIndex = selectedId ? flatList.findIndex((o) => o.id === selectedId) : -1;
  const selectedOrder = selectedIndex >= 0 ? flatList[selectedIndex] : null;

  const byStatus = useMemo(() => {
    const map: Record<string, EnrichedOrder[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    for (const o of orders) {
      if (map[o.status]) map[o.status].push(o);
    }
    return map;
  }, [orders]);

  const openOrder = useCallback(
    (orderId: string) => {
      setSelectedId(orderId);
      router.replace(`/admin/orders?order=${encodeURIComponent(orderId)}`, { scroll: false });
    },
    [router],
  );

  const closeDetail = useCallback(() => {
    setSelectedId(null);
    router.replace("/admin/orders", { scroll: false });
  }, [router]);

  async function advance(order: EnrichedOrder) {
    const next = NEXT[order.status];
    if (!next) return;
    setAdvancing(true);
    try {
      const res = await fetchApi(`/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Não foi possível atualizar o pedido.");
        return;
      }
      await load();
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">Pedidos</h1>
      </div>

      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="min-w-[280px] flex-1 rounded-2xl border border-white/5 bg-surface-2 p-4">
            <h2 className="mb-3 font-semibold">
              {col.label} ({byStatus[col.status]?.length || 0})
            </h2>
            <ul className="space-y-3">
              {(byStatus[col.status] || []).map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => openOrder(o.id)}
                    className={cn(
                      "w-full rounded-xl bg-surface p-3 text-left text-sm transition hover:ring-1 hover:ring-brand/40",
                      selectedId === o.id && "ring-2 ring-brand",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold">#{o.number} · Mesa {o.tableNumber}</p>
                      <span className={cn("text-xs", minutesSince(o.createdAt) > 15 && "text-danger")}>
                        {minutesSince(o.createdAt)} min
                      </span>
                    </div>
                    <p className="text-muted">
                      {formatTime(o.createdAt)} · {formatCurrency(o.total)}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-soft">{serviceTypeLabel(o.serviceType)}</p>
                    {o.guest?.name ? <p className="text-xs text-muted">{o.guest.name}</p> : null}
                    <ul className="mt-2 space-y-1 text-xs">
                      {o.items.slice(0, 4).map((item) => (
                        <li key={item.id} className="text-muted">{formatItemPreview(item)}</li>
                      ))}
                      {o.items.length > 4 ? (
                        <li className="text-muted">+{o.items.length - 4} itens</li>
                      ) : null}
                    </ul>
                    {NEXT[o.status] && (
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={(event) => {
                          event.stopPropagation();
                          void advance(o);
                        }}
                      >
                        Avançar
                      </Button>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedOrder && selectedIndex >= 0 ? (
        <OrderDetailPanel
          order={selectedOrder}
          orders={flatList}
          index={selectedIndex}
          establishmentName={establishment?.name || "Estabelecimento"}
          onClose={closeDetail}
          onNavigate={(index) => openOrder(flatList[index].id)}
          onAdvance={(order) => void advance(order)}
          advancing={advancing}
        />
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { WaiterActionButton, WaiterAccountIcon } from "@/components/waiter/waiter-shell";
import { OrderCatalog } from "@/components/shared/order-catalog";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Category, Order, Product } from "@/lib/types";

function WaiterTableContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("id") || "";
  const { fetchApi } = useAuth();
  const [tab, setTab] = useState<"order" | "orders" | "account">("order");
  const [table, setTable] = useState<{ id: string; number: string; name: string; status: string; commandId?: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!tableId) return;
    setLoading(true);
    try {
      const tablesRes = await fetchApi("/admin/tables?operational=1");
      const tablesJson = await tablesRes.json();
      const found = (tablesJson.tables || []).find((t: { id: string }) => t.id === tableId);
      setTable(found || null);

      if (found?.commandId) {
        const ordersResponse = await fetchApi(`/admin/orders?commandId=${encodeURIComponent(found.commandId)}`);
        const ordersJson = await ordersResponse.json();
        setOrders(ordersJson.orders || []);
      } else {
        setOrders([]);
      }

      const menuRes = await fetchApi("/admin/menu");
      const menuJson = await menuRes.json();
      if (!menuRes.ok) {
        setError(menuJson.error || "Falha ao carregar cardápio");
        return;
      }
      setProducts(menuJson.products || []);
      setCategories(menuJson.categories || []);
    } catch {
      setError("Falha ao carregar mesa");
    } finally {
      setLoading(false);
    }
  }, [fetchApi, tableId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function requestAccount() {
    if (!tableId) return;
    setBusy(true);
    setError("");
    const res = await fetchApi(`/admin/tables/${tableId}/request-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: "TABLE" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao pedir conta");
    } else {
      setFeedback("Conta solicitada");
      void load();
    }
    setBusy(false);
  }

  if (!tableId) {
    return <p className="text-muted">Mesa inválida.</p>;
  }

  if (loading && !table) {
    return <p className="text-muted py-8 text-center">Carregando…</p>;
  }

  return (
    <div className="space-y-4">
      <Link href="/waiter" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div>
        <h1 className="text-xl font-bold">Mesa {table?.number}</h1>
        <p className="text-sm text-muted">{table?.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["order", "orders", "account"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "min-h-11 rounded-xl border text-sm font-medium",
              tab === value ? "border-brand bg-brand/15 text-brand" : "border-white/10 text-muted",
            )}
          >
            {value === "order" ? "Pedir" : value === "orders" ? "Pedidos" : "Conta"}
          </button>
        ))}
      </div>

      {feedback && <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{feedback}</p>}
      {error && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

      {tab === "order" && (
        <CartProvider key={tableId}>
          <OrderCatalog
            categories={categories}
            products={products}
            defaultServiceType="COMER_AQUI"
            submitLabel="Enviar pedido"
            onNotify={(message, tone) => {
              if (tone === "error") {
                setError(message);
                setFeedback("");
              } else {
                setFeedback(message);
                setError("");
                void load();
              }
            }}
            onSubmit={async ({ items, serviceType }) => {
              const res = await fetchApi("/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableId, items, serviceType }),
              });
              const json = await res.json();
              if (!res.ok) {
                return { ok: false, error: json.error || "Falha ao enviar pedido" };
              }
              return { ok: true, orderNumber: json.order?.number };
            }}
          />
        </CartProvider>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">#{order.number}</p>
                <span className="text-xs text-muted">{(order as Order & { originLabel?: string }).originLabel || order.orderOrigin || "Cliente"}</span>
              </div>
              <p className="text-sm text-muted">{formatCurrency(order.total)}</p>
            </div>
          ))}
          {!orders.length && <p className="text-sm text-muted">Nenhum pedido nesta mesa.</p>}
        </div>
      )}

      {tab === "account" && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Solicite a conta para o caixa. O histórico permanece na comanda.</p>
          <WaiterActionButton onClick={() => void requestAccount()} disabled={busy}>
            <WaiterAccountIcon /> Pedir conta
          </WaiterActionButton>
        </div>
      )}
    </div>
  );
}

export default function WaiterTablePage() {
  return (
    <Suspense fallback={<p className="text-muted py-8 text-center">Carregando…</p>}>
      <WaiterTableContent />
    </Suspense>
  );
}

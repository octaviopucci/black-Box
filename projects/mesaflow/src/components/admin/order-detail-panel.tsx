"use client";

import { ChevronLeft, ChevronRight, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatItemAddons,
  formatOrderDateTime,
  orderItemsSubtotal,
  orderLineSubtotal,
  orderLineUnitPrice,
  serviceTypeLabel,
  type EnrichedOrder,
} from "@/lib/order-display";
import { formatCurrency, orderStatusLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";
import { OrderPrintView, printOrderComanda } from "./order-print";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  NOVO: "ACEITO",
  ACEITO: "EM_PREPARO",
  EM_PREPARO: "PRONTO",
  PRONTO: "ENTREGUE",
};

type OrderDetailPanelProps = {
  order: EnrichedOrder;
  orders: EnrichedOrder[];
  index: number;
  establishmentName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onAdvance: (order: EnrichedOrder) => void;
  advancing?: boolean;
};

export function OrderDetailPanel({
  order,
  orders,
  index,
  establishmentName,
  onClose,
  onNavigate,
  onAdvance,
  advancing,
}: OrderDetailPanelProps) {
  const subtotal = orderItemsSubtotal(order.items);
  const showSubtotal = order.items.length > 1;
  const nextStatus = NEXT[order.status];
  const canPrint = order.status === "ACEITO";

  return (
    <>
      <OrderPrintView order={order} establishmentName={establishmentName} />
      <div className="fixed inset-0 z-50 flex items-end bg-black/70 print:hidden sm:items-center sm:justify-center sm:p-4">
        <div
          className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface sm:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={index <= 0}
                onClick={() => onNavigate(index - 1)}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-2 disabled:opacity-30"
                aria-label="Pedido anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-xs text-muted">
                {index + 1} / {orders.length}
              </span>
              <button
                type="button"
                disabled={index >= orders.length - 1}
                onClick={() => onNavigate(index + 1)}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-2 disabled:opacity-30"
                aria-label="Próximo pedido"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-surface-2" aria-label="Fechar">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="order-detail-title" className="font-[family-name:var(--font-display)] text-xl font-bold">
                  Pedido #{order.number}
                </h2>
                <p className="text-sm text-muted">{formatOrderDateTime(order.createdAt)}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusBadgeClass(order.status))}>
                {orderStatusLabel(order.status)}
              </span>
            </div>

            <dl className="mb-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-muted">Mesa</dt>
                <dd className="font-medium">{order.tableNumber || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Modalidade</dt>
                <dd className="font-medium">{serviceTypeLabel(order.serviceType)}</dd>
              </div>
              {order.guest?.name ? (
                <div>
                  <dt className="text-muted">Cliente</dt>
                  <dd className="font-medium">{order.guest.name}</dd>
                </div>
              ) : null}
              {order.guest?.phone ? (
                <div>
                  <dt className="text-muted">Celular</dt>
                  <dd className="font-medium">{order.guest.phone}</dd>
                </div>
              ) : null}
            </dl>

            <h3 className="mb-2 text-sm font-semibold">Itens do pedido</h3>
            <ul className="space-y-3">
              {order.items.map((item) => {
                const extras = formatItemAddons(item);
                return (
                  <li key={item.id} className="rounded-xl bg-surface-2 p-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium">
                        {item.qty}x {item.productName}
                      </p>
                      <p className="shrink-0 font-semibold text-brand">{formatCurrency(orderLineSubtotal(item))}</p>
                    </div>
                    {extras ? <p className="mt-1 text-xs text-muted">{extras}</p> : null}
                    <p className="mt-1 text-xs text-muted">
                      Valor unitário: {formatCurrency(orderLineUnitPrice(item))}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 space-y-1 border-t border-white/5 pt-3 text-sm">
              {showSubtotal ? (
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {order.notes ? <p className="mt-3 text-sm text-muted">Obs: {order.notes}</p> : null}
          </div>

          <div className="flex gap-2 border-t border-white/5 p-4 safe-bottom">
            {canPrint ? (
              <Button variant="secondary" className="flex-1" onClick={() => printOrderComanda()}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir pedido
              </Button>
            ) : null}
            {nextStatus ? (
              <Button className="flex-1" loading={advancing} onClick={() => onAdvance(order)}>
                Avançar para {orderStatusLabel(nextStatus)}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function statusBadgeClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    NOVO: "bg-warning/15 text-warning",
    ACEITO: "bg-brand/15 text-brand",
    EM_PREPARO: "bg-brand-soft/15 text-brand-soft",
    PRONTO: "bg-success/15 text-success",
    ENTREGUE: "bg-muted/15 text-muted",
    CANCELADO: "bg-danger/15 text-danger",
  };
  return map[status] || "bg-surface-2 text-muted";
}

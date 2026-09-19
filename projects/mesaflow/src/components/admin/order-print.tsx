"use client";

import {
  formatItemAddons,
  formatOrderDateTime,
  orderItemsSubtotal,
  orderLineSubtotal,
  orderLineUnitPrice,
  serviceTypeLabel,
  type EnrichedOrder,
} from "@/lib/order-display";
import { formatCurrency } from "@/lib/format";
import { orderStatusLabel } from "@/lib/format";

type OrderPrintProps = {
  order: EnrichedOrder;
  establishmentName: string;
};

export function OrderPrintView({ order, establishmentName }: OrderPrintProps) {
  const subtotal = orderItemsSubtotal(order.items);
  const showSubtotal = order.items.length > 1;

  return (
    <div id="mesaflow-order-print" className="hidden print:block">
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 4mm; }
          body * { visibility: hidden; }
          #mesaflow-order-print, #mesaflow-order-print * { visibility: visible; }
          #mesaflow-order-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 72mm;
            font-family: ui-monospace, monospace;
            font-size: 11px;
            line-height: 1.35;
            color: #000;
            background: #fff;
          }
        }
      `}</style>
      <div className="p-1">
        <p className="text-center text-sm font-bold tracking-wide">NA MESA</p>
        <p className="text-center text-[10px] text-gray-600">Comanda de pedido</p>
        <hr className="my-2 border-dashed border-gray-400" />
        <p><strong>Pedido:</strong> #{order.number}</p>
        <p><strong>Data:</strong> {formatOrderDateTime(order.createdAt)}</p>
        <p><strong>Lanchonete:</strong> {establishmentName}</p>
        {order.tableNumber ? <p><strong>Mesa:</strong> {order.tableNumber}</p> : null}
        <p><strong>Modalidade:</strong> {serviceTypeLabel(order.serviceType)}</p>
        <hr className="my-2 border-dashed border-gray-400" />
        <p className="font-semibold">Cliente</p>
        {order.guest?.name ? <p>Nome: {order.guest.name}</p> : null}
        {order.guest?.phone ? <p>Celular: {order.guest.phone}</p> : null}
        {order.guest?.comandaNumber ? <p>Comanda: {order.guest.comandaNumber}</p> : null}
        {!order.guest?.name && !order.guest?.phone ? <p className="text-gray-600">—</p> : null}
        <hr className="my-2 border-dashed border-gray-400" />
        <p className="mb-1 font-semibold">Itens</p>
        {order.items.map((item) => {
          const extras = formatItemAddons(item);
          return (
            <div key={item.id} className="mb-2">
              <p className="font-medium">
                {item.qty}x {item.productName}
              </p>
              {extras ? <p className="pl-2 text-[10px] text-gray-700">{extras}</p> : null}
              <p className="pl-2 text-[10px]">
                Unit: {formatCurrency(orderLineUnitPrice(item))} · Subtotal: {formatCurrency(orderLineSubtotal(item))}
              </p>
            </div>
          );
        })}
        <hr className="my-2 border-dashed border-gray-400" />
        {showSubtotal ? <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></p> : null}
        <p className="flex justify-between text-sm font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </p>
        {order.notes ? <p className="mt-1 text-[10px]">Obs pedido: {order.notes}</p> : null}
        <p className="mt-1 text-[10px]">Status: {orderStatusLabel(order.status)}</p>
        <hr className="my-2 border-dashed border-gray-400" />
        <p className="text-center text-[10px] text-gray-600">Emitido por NA MESA</p>
        <p className="text-center text-[9px] text-gray-500">Documento não fiscal</p>
      </div>
    </div>
  );
}

export function printOrderComanda(): void {
  window.print();
}

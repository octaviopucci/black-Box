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
          @page {
            size: 58mm auto;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 58mm;
            max-width: 58mm;
            overflow-x: hidden !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden;
          }

          #mesaflow-order-print,
          #mesaflow-order-print * {
            visibility: visible;
          }

          #mesaflow-order-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 54mm;
            max-width: 260px;
            padding: 2mm 2mm 3mm;
            margin: 0;
            box-sizing: border-box;
            overflow: hidden;
            font-family: ui-monospace, monospace;
            font-size: 10px;
            line-height: 1.3;
            color: #000;
            background: #fff;
          }

          #mesaflow-order-print * {
            box-sizing: border-box;
            max-width: 100%;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          #mesaflow-order-print p {
            margin: 0 0 2px;
          }

          #mesaflow-order-print hr {
            margin: 6px 0;
            border: 0;
            border-top: 1px dashed #666;
          }

          #mesaflow-order-print .print-title {
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.04em;
          }

          #mesaflow-order-print .print-subtitle {
            font-size: 9px;
            text-align: center;
            color: #444;
          }

          #mesaflow-order-print .print-section {
            font-weight: 600;
            margin-bottom: 3px;
          }

          #mesaflow-order-print .print-item {
            margin-bottom: 6px;
          }

          #mesaflow-order-print .print-item-name {
            font-weight: 600;
          }

          #mesaflow-order-print .print-item-extra,
          #mesaflow-order-print .print-item-price {
            font-size: 9px;
            color: #333;
            padding-left: 6px;
          }

          #mesaflow-order-print .print-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 4px;
          }

          #mesaflow-order-print .print-row-label {
            flex: 1 1 auto;
            min-width: 0;
          }

          #mesaflow-order-print .print-row-value {
            flex: 0 0 auto;
            white-space: nowrap;
          }

          #mesaflow-order-print .print-total {
            font-size: 11px;
            font-weight: 700;
          }

          #mesaflow-order-print .print-footer {
            font-size: 9px;
            text-align: center;
            color: #444;
          }

          #mesaflow-order-print .print-footer-muted {
            font-size: 8px;
            text-align: center;
            color: #666;
          }
        }
      `}</style>
      <div>
        <p className="print-title">NA MESA</p>
        <p className="print-subtitle">Comanda de pedido</p>
        <hr />
        <p>
          <strong>Pedido:</strong> #{order.number}
        </p>
        <p>
          <strong>Data:</strong> {formatOrderDateTime(order.createdAt)}
        </p>
        <p>
          <strong>Lanchonete:</strong> {establishmentName}
        </p>
        {order.tableNumber ? (
          <p>
            <strong>Mesa:</strong> {order.tableNumber}
          </p>
        ) : null}
        <p>
          <strong>Modalidade:</strong> {serviceTypeLabel(order.serviceType)}
        </p>
        <hr />
        <p className="print-section">Cliente</p>
        {order.guest?.name ? <p>Nome: {order.guest.name}</p> : null}
        {order.guest?.phone ? <p>Celular: {order.guest.phone}</p> : null}
        {order.guest?.comandaNumber ? <p>Comanda: {order.guest.comandaNumber}</p> : null}
        {!order.guest?.name && !order.guest?.phone ? <p style={{ color: "#666" }}>—</p> : null}
        <hr />
        <p className="print-section">Itens</p>
        {order.items.map((item) => {
          const extras = formatItemAddons(item);
          return (
            <div key={item.id} className="print-item">
              <p className="print-item-name">
                {item.qty}x {item.productName}
              </p>
              {extras ? <p className="print-item-extra">{extras}</p> : null}
              <p className="print-item-price">Unit: {formatCurrency(orderLineUnitPrice(item))}</p>
              <p className="print-item-price">Subtotal: {formatCurrency(orderLineSubtotal(item))}</p>
            </div>
          );
        })}
        <hr />
        {showSubtotal ? (
          <p className="print-row">
            <span className="print-row-label">Subtotal</span>
            <span className="print-row-value">{formatCurrency(subtotal)}</span>
          </p>
        ) : null}
        <p className="print-row print-total">
          <span className="print-row-label">Total</span>
          <span className="print-row-value">{formatCurrency(order.total)}</span>
        </p>
        {order.notes ? <p style={{ fontSize: "9px", marginTop: "4px" }}>Obs pedido: {order.notes}</p> : null}
        <p style={{ fontSize: "9px" }}>Status: {orderStatusLabel(order.status)}</p>
        <hr />
        <p className="print-footer">Emitido por NA MESA</p>
        <p className="print-footer-muted">Documento não fiscal</p>
      </div>
    </div>
  );
}

export function printOrderComanda(): void {
  window.print();
}

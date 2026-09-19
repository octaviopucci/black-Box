import type { EnrichedOrder } from "@/lib/order-display";
import { formatCurrency } from "@/lib/format";

/**
 * Notificações in-tab via Web Notifications API.
 *
 * Limitação: alerta real com browser fechado exige Web Push + service worker + VAPID
 * (backend de subscription). Aqui cobrimos tab em background / outro app com sessão admin aberta.
 * O admin precisa permitir notificações no browser e manter a sessão logada.
 */

export type NotificationPermissionState = NotificationPermission | "unsupported";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/** Pede permissão — idealmente após gesto do usuário (ex.: clique no sino). */
export async function requestOrderNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return Notification.permission;
  }
}

export function showNewOrderNotification(order: EnrichedOrder, establishmentName?: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return;

  const title = establishmentName ? `Novo pedido · ${establishmentName}` : "Novo pedido";
  const body = `#${order.number} · Mesa ${order.tableNumber} · ${formatCurrency(order.total)}`;

  try {
    const notification = new Notification(title, {
      body,
      tag: `mesaflow-order-${order.id}`,
      icon: "/brand/icon-round-192.png",
      requireInteraction: false,
    });
    notification.onclick = () => {
      window.focus();
      window.location.href = `/admin/orders?order=${encodeURIComponent(order.id)}`;
      notification.close();
    };
  } catch {
    /* optional */
  }
}

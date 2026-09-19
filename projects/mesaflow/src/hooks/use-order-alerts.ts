"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseApiJson } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useRealtime } from "@/hooks/use-realtime";
import type { EnrichedOrder } from "@/lib/order-display";
import { isOrderSoundMuted, playOrderBell } from "@/lib/order-alert-sound";
import {
  getNotificationPermission,
  requestOrderNotificationPermission,
  showNewOrderNotification,
  type NotificationPermissionState,
} from "@/lib/order-notifications";

type OrdersPayload = { orders: EnrichedOrder[] };

export type OrderAlert = {
  order: EnrichedOrder;
  receivedAt: number;
};

/**
 * Listener global de novos pedidos no admin — som + banner in-app + Web Notification em qualquer rota.
 */
export function useOrderAlerts() {
  const { session, fetchApi } = useAuth();
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("default");
  const [pendingAlerts, setPendingAlerts] = useState<OrderAlert[]>([]);
  const seenOrderIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  const dismissAlert = useCallback((orderId: string) => {
    setPendingAlerts((current) => current.filter((entry) => entry.order.id !== orderId));
  }, []);

  const dismissAllAlerts = useCallback(() => {
    setPendingAlerts([]);
  }, []);

  const pollOrders = useCallback(async () => {
    if (!session?.establishment.slug) return;
    try {
      const res = await fetchApi("/admin/orders");
      if (!res.ok) return;
      const json = (await parseApiJson(res)) as OrdersPayload;
      const orders = json.orders || [];

      if (!initialized.current) {
        for (const order of orders) seenOrderIds.current.add(order.id);
        initialized.current = true;
        if (!orders.length) return;
        return;
      }

      const soundEnabled = session.establishment.settings.soundNotifications !== false;
      const fresh = orders.filter((o) => o.status === "NOVO" && !seenOrderIds.current.has(o.id));

      if (fresh.length > 0) {
        const now = Date.now();
        setPendingAlerts((current) => {
          const existing = new Set(current.map((entry) => entry.order.id));
          const next = [...current];
          for (const order of fresh) {
            if (existing.has(order.id)) continue;
            next.push({ order, receivedAt: now });
          }
          return next;
        });

        if (soundEnabled && !isOrderSoundMuted()) {
          playOrderBell();
        }

        for (const order of fresh) {
          showNewOrderNotification(order, session.establishment.name);
        }
      }

      for (const order of orders) seenOrderIds.current.add(order.id);
    } catch {
      /* silent poll */
    }
  }, [session, fetchApi]);

  useEffect(() => {
    void pollOrders();
  }, [pollOrders]);

  useRealtime(session?.establishment.id, pollOrders);

  const enableNotifications = useCallback(async () => {
    const result = await requestOrderNotificationPermission();
    setNotificationPermission(result);
    return result;
  }, []);

  return {
    notificationPermission,
    enableNotifications,
    pendingAlerts,
    dismissAlert,
    dismissAllAlerts,
  };
}

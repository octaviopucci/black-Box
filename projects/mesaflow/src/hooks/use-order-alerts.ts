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

/**
 * Listener global de novos pedidos no admin — som + Web Notification em qualquer rota.
 */
export function useOrderAlerts() {
  const { session, fetchApi } = useAuth();
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("default");
  const seenOrderIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  const pollOrders = useCallback(async () => {
    if (!session?.establishment.slug) return;
    try {
      const res = await fetchApi("/admin/orders");
      if (!res.ok) return;
      const json = (await parseApiJson(res)) as OrdersPayload;
      const orders = json.orders || [];
      if (!orders.length) {
        if (!initialized.current) initialized.current = true;
        return;
      }

      if (!initialized.current) {
        for (const order of orders) seenOrderIds.current.add(order.id);
        initialized.current = true;
        return;
      }

      const soundEnabled = session.establishment.settings.soundNotifications !== false;
      const fresh = orders.filter((o) => o.status === "NOVO" && !seenOrderIds.current.has(o.id));

      if (fresh.length > 0 && soundEnabled && !isOrderSoundMuted()) {
        playOrderBell();
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

  return { notificationPermission, enableNotifications };
}

"use client";

import { useEffect } from "react";

export function useRealtime(establishmentId: string | undefined, onEvent: () => void) {
  useEffect(() => {
    if (!establishmentId) return;
    const es = new EventSource(`/api/events?establishmentId=${establishmentId}`);
    es.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type && data.type !== "ping" && data.type !== "connected") onEvent();
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, [establishmentId, onEvent]);
}

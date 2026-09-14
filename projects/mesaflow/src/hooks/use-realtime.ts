"use client";

import { useEffect } from "react";

/** Polling leve — compatível com serverless (sem SSE long-lived). */
export function useRealtime(establishmentId: string | undefined, onEvent: () => void) {
  useEffect(() => {
    if (!establishmentId) return;
    const id = setInterval(onEvent, 4000);
    return () => clearInterval(id);
  }, [establishmentId, onEvent]);
}

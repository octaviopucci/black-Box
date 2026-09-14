"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";

export function useAdminData<T = unknown>() {
  const { session, authHeaders } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.establishment.slug) return;
    const res = await fetch(
      apiUrl(`/admin/dashboard?slug=${encodeURIComponent(session.establishment.slug)}`),
      { headers: authHeaders() },
    );
    const json = await res.json();
    setData(json as T);
    setLoading(false);
  }, [session?.establishment.slug, authHeaders]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(session?.establishment.id, load);

  return { data, loading, load, establishment: session?.establishment };
}

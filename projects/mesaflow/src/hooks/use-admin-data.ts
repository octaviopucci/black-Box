"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRealtime } from "@/hooks/use-realtime";

export function useAdminData<T = unknown>() {
  const { session, fetchApi, logout } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.establishment.slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetchApi(
      `/admin/dashboard?slug=${encodeURIComponent(session.establishment.slug)}`,
    );
    if (res.status === 401) {
      logout();
      setData(null);
      setLoading(false);
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setData(null);
      setLoading(false);
      return;
    }
    setData(json as T);
    setLoading(false);
  }, [session?.establishment.slug, fetchApi, logout]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(session?.establishment.id, load);

  return { data, loading, load, establishment: session?.establishment };
}

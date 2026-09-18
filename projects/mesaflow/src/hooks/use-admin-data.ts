"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";

export function useAdminData<T = unknown>() {
  const { session, authHeaders, logout, credentials } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.establishment.slug) return;
    const res = await fetch(
      apiUrl(`/admin/dashboard?slug=${encodeURIComponent(session.establishment.slug)}`),
      { credentials, headers: authHeaders() },
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
  }, [session?.establishment.slug, authHeaders, logout]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(session?.establishment.id, load);

  return { data, loading, load, establishment: session?.establishment };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { parseApiJson } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useRealtime } from "@/hooks/use-realtime";

export function useAdminData<T = unknown>() {
  const { session, fetchApi, logout } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!session?.establishment.slug) {
        setLoading(false);
        setError("");
        return;
      }
      if (!opts?.silent) {
        setLoading(true);
        setError("");
      }
      try {
        const res = await fetchApi("/admin/orders");
        if (res.status === 401) {
          logout();
          setData(null);
          setError("");
          return;
        }
        const json = (await parseApiJson(res)) as { error?: string };
        if (!res.ok) {
          setData(null);
          setError(json.error || `Erro ${res.status} ao carregar dados.`);
          return;
        }
        setData(json as T);
        setError("");
      } catch (loadError) {
        setData(null);
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar dados.");
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [session?.establishment.slug, fetchApi, logout],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useRealtime(session?.establishment.id, () => load({ silent: true }));

  return { data, loading, error, load, establishment: session?.establishment };
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { staffFetch } from "@/lib/api";
import type { PlatformUserRole } from "@/lib/types";

export type PlatformSession = {
  token?: string;
  user: { id: string; name: string; email: string; role: PlatformUserRole };
};

type PlatformAuthContextValue = {
  session: PlatformSession | null;
  loading: boolean;
  setSession: (session: PlatformSession) => void;
  logout: () => Promise<void>;
  authHeaders: () => Record<string, string>;
  credentials: RequestCredentials;
  fetchApi: (path: string, init?: RequestInit) => Promise<Response>;
};

const PlatformAuthContext = createContext<PlatformAuthContextValue | null>(null);

export function PlatformAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<PlatformSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffFetch("/platform/auth/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const json = await res.json();
        setSessionState({ user: json.user });
      })
      .catch(() => setSessionState(null))
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((next: PlatformSession) => {
    setSessionState(next);
  }, []);

  const logout = useCallback(async () => {
    await staffFetch("/platform/auth/logout", { method: "POST" });
    setSessionState(null);
  }, []);

  const authHeaders = useCallback((): Record<string, string> => {
    if (!session?.token) return {};
    return { Authorization: `Bearer ${session.token}` };
  }, [session?.token]);

  const fetchApi = useCallback(
    (path: string, init: RequestInit = {}) =>
      staffFetch(path, {
        ...init,
        headers: { ...authHeaders(), ...(init.headers as Record<string, string> | undefined) },
      }),
    [authHeaders],
  );

  const value = useMemo(
    () => ({
      session,
      loading,
      setSession,
      logout,
      authHeaders,
      credentials: "include" as const,
      fetchApi,
    }),
    [session, loading, setSession, logout, authHeaders, fetchApi],
  );

  return <PlatformAuthContext.Provider value={value}>{children}</PlatformAuthContext.Provider>;
}

export function usePlatformAuth() {
  const ctx = useContext(PlatformAuthContext);
  if (!ctx) throw new Error("usePlatformAuth must be used within PlatformAuthProvider");
  return ctx;
}

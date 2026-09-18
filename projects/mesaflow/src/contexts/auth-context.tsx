"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl, staffFetch } from "@/lib/api";
import type { Establishment, User } from "@/lib/types";

export type AuthSession = {
  /** Memória da aba — cookie HttpOnly `mf_as` persiste entre reloads. */
  token?: string;
  user: Pick<User, "id" | "name" | "email" | "role">;
  establishment: Establishment;
};

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
  authHeaders: () => Record<string, string>;
  credentials: RequestCredentials;
  fetchApi: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffFetch("/auth/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const json = await res.json();
        setSessionState({ user: json.user, establishment: json.establishment });
      })
      .catch(() => setSessionState(null))
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    setSessionState(next);
  }, []);

  const logout = useCallback(async () => {
    await staffFetch("/auth/logout", { method: "POST" });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

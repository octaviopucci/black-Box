"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { staffFetch } from "@/lib/api";
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
  refreshSession: () => Promise<AuthSession | null>;
  logout: () => Promise<void>;
  authHeaders: () => Record<string, string>;
  credentials: RequestCredentials;
  fetchApi: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionFromAuthMe(
  json: { user: AuthSession["user"]; establishment: Establishment },
  token?: string,
): AuthSession {
  return { token, user: json.user, establishment: json.establishment };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<AuthSession | null> => {
    try {
      const res = await staffFetch("/auth/me");
      if (!res.ok) {
        setSessionState(null);
        return null;
      }
      const json = await res.json();
      let resolved: AuthSession | null = null;
      setSessionState((prev) => {
        resolved = sessionFromAuthMe(json, prev?.token);
        return resolved;
      });
      return resolved;
    } catch {
      setSessionState(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

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
      refreshSession,
      logout,
      authHeaders,
      credentials: "include" as const,
      fetchApi,
    }),
    [session, loading, setSession, refreshSession, logout, authHeaders, fetchApi],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
